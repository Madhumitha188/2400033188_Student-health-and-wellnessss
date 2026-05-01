package com.studenthealth.backend.controller;

import com.studenthealth.backend.dto.RequestDtos;
import com.studenthealth.backend.entity.ActivityEvent;
import com.studenthealth.backend.entity.ProgramEnrollment;
import com.studenthealth.backend.entity.UserAccount;
import com.studenthealth.backend.entity.WellnessProgram;
import com.studenthealth.backend.repository.ActivityEventRepository;
import com.studenthealth.backend.repository.ProgramEnrollmentRepository;
import com.studenthealth.backend.repository.UserAccountRepository;
import com.studenthealth.backend.repository.WellnessProgramRepository;
import com.studenthealth.backend.util.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProgramController {
    private final WellnessProgramRepository programRepo;
    private final ProgramEnrollmentRepository enrollmentRepo;
    private final UserAccountRepository userRepo;
    private final ActivityEventRepository eventRepo;
    private final AuthUtil authUtil;

    public ProgramController(WellnessProgramRepository programRepo,
                             ProgramEnrollmentRepository enrollmentRepo,
                             UserAccountRepository userRepo,
                             ActivityEventRepository eventRepo,
                             AuthUtil authUtil) {
        this.programRepo = programRepo;
        this.enrollmentRepo = enrollmentRepo;
        this.userRepo = userRepo;
        this.eventRepo = eventRepo;
        this.authUtil = authUtil;
    }

    @GetMapping("/programs")
    public List<Map<String, Object>> listStudentPrograms(@RequestHeader("Authorization") String authHeader) {
        String email = authUtil.emailFromHeader(authHeader);
        return programRepo.findByStatusOrderByIdDesc("ACTIVE").stream().map(p -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", p.getId());
            row.put("name", p.getName());
            row.put("type", p.getType());
            row.put("description", p.getDescription());
            row.put("duration", p.getDuration());
            row.put("startDate", p.getStartDate());
            row.put("status", p.getStatus());
            row.put("participants", enrollmentRepo.countByProgramId(p.getId()));
            row.put("enrolled", enrollmentRepo.existsByUserEmailIgnoreCaseAndProgramId(email, p.getId()));
            return row;
        }).toList();
    }

    @PostMapping("/programs/{id}/enroll")
    public Map<String, String> enroll(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        String email = authUtil.emailFromHeader(authHeader);
        WellnessProgram program = programRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Program not found"));
        if (!"ACTIVE".equals(program.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Program is not active");
        }

        if (!enrollmentRepo.existsByUserEmailIgnoreCaseAndProgramId(email, id)) {
            UserAccount user = userRepo.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
            ProgramEnrollment e = new ProgramEnrollment();
            e.setProgram(program);
            e.setUser(user);
            enrollmentRepo.save(e);

            ActivityEvent event = new ActivityEvent();
            event.setUserEmail(email);
            event.setActionType("PROGRAM_ENROLL");
            event.setActionLabel("Program Enrollment");
            event.setDetail(program.getName());
            eventRepo.save(event);
        }

        return Map.of("message", "Enrolled successfully");
    }

    @GetMapping("/admin/programs")
    public List<Map<String, Object>> listAdminPrograms() {
        return programRepo.findAll().stream().map(p -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", p.getId());
            row.put("name", p.getName());
            row.put("type", p.getType());
            row.put("description", p.getDescription());
            row.put("duration", p.getDuration());
            row.put("startDate", p.getStartDate());
            row.put("status", p.getStatus());
            row.put("participants", enrollmentRepo.countByProgramId(p.getId()));
            return row;
        }).toList();
    }

    @PostMapping("/admin/programs")
    @ResponseStatus(HttpStatus.CREATED)
    public WellnessProgram create(@RequestBody RequestDtos.ProgramRequest req) {
        if (req == null || blank(req.name) || blank(req.type) || blank(req.description)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name, type and description are required");
        }
        WellnessProgram p = new WellnessProgram();
        p.setName(req.name.trim());
        p.setType(req.type.trim());
        p.setDescription(req.description.trim());
        p.setDuration(blank(req.duration) ? null : req.duration.trim());
        p.setStartDate(req.startDate);
        return programRepo.save(p);
    }

    @PatchMapping("/admin/programs/{id}/status")
    public WellnessProgram toggleStatus(@PathVariable Long id) {
        WellnessProgram p = programRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Program not found"));
        p.setStatus("ACTIVE".equals(p.getStatus()) ? "INACTIVE" : "ACTIVE");
        return programRepo.save(p);
    }

    @DeleteMapping("/admin/programs/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!programRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Program not found");
        }
        enrollmentRepo.deleteByProgramId(id);
        programRepo.deleteById(id);
    }

    private boolean blank(String s) { return s == null || s.trim().isEmpty(); }
}

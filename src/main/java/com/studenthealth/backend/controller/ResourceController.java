package com.studenthealth.backend.controller;

import com.studenthealth.backend.dto.RequestDtos;
import com.studenthealth.backend.entity.ActivityEvent;
import com.studenthealth.backend.entity.HealthResource;
import com.studenthealth.backend.repository.ActivityEventRepository;
import com.studenthealth.backend.repository.HealthResourceRepository;
import com.studenthealth.backend.util.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ResourceController {
    private final HealthResourceRepository resourceRepo;
    private final ActivityEventRepository eventRepo;
    private final AuthUtil authUtil;

    public ResourceController(HealthResourceRepository resourceRepo, ActivityEventRepository eventRepo, AuthUtil authUtil) {
        this.resourceRepo = resourceRepo;
        this.eventRepo = eventRepo;
        this.authUtil = authUtil;
    }

    @GetMapping("/resources")
    public List<Map<String, Object>> listForStudents() {
        return resourceRepo.findByStatusOrderByIdDesc("ACTIVE").stream().map(r -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", r.getId());
            row.put("title", r.getTitle());
            row.put("category", r.getCategory());
            row.put("description", r.getDescription());
            row.put("contact", r.getContactEmail());
            row.put("phone", r.getPhone());
            row.put("status", r.getStatus());
            return row;
        }).toList();
    }

    @PostMapping("/activity/resources/{id}/access")
    public Map<String, String> recordAccess(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        String email = authUtil.emailFromHeader(authHeader);
        HealthResource r = resourceRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));
        ActivityEvent e = new ActivityEvent();
        e.setUserEmail(email);
        e.setActionType("RESOURCE_ACCESS");
        e.setActionLabel("Resource Access");
        e.setDetail(r.getTitle() + " (" + r.getCategory() + ")");
        eventRepo.save(e);
        return Map.of("message", "Access recorded");
    }

    @GetMapping("/admin/resources")
    public List<HealthResource> listAdmin() {
        return resourceRepo.findAll();
    }

    @PostMapping("/admin/resources")
    @ResponseStatus(HttpStatus.CREATED)
    public HealthResource create(@RequestBody RequestDtos.ResourceRequest req) {
        validate(req);
        HealthResource r = new HealthResource();
        r.setTitle(req.title.trim());
        r.setCategory(req.category.trim());
        r.setDescription(req.description.trim());
        r.setContactEmail(blank(req.contactEmail) ? null : req.contactEmail.trim());
        r.setPhone(blank(req.phone) ? null : req.phone.trim());
        return resourceRepo.save(r);
    }

    @PatchMapping("/admin/resources/{id}/status")
    public HealthResource toggleStatus(@PathVariable Long id) {
        HealthResource r = resourceRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));
        r.setStatus("ACTIVE".equals(r.getStatus()) ? "INACTIVE" : "ACTIVE");
        return resourceRepo.save(r);
    }

    @DeleteMapping("/admin/resources/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!resourceRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found");
        }
        resourceRepo.deleteById(id);
    }

    private void validate(RequestDtos.ResourceRequest req) {
        if (req == null || blank(req.title) || blank(req.category) || blank(req.description)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "title, category and description are required");
        }
    }

    private boolean blank(String s) { return s == null || s.trim().isEmpty(); }
}

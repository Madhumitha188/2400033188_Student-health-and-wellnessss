package com.studenthealth.backend.controller;

import com.studenthealth.backend.dto.RequestDtos;
import com.studenthealth.backend.entity.SupportRequest;
import com.studenthealth.backend.repository.SupportRequestRepository;
import com.studenthealth.backend.util.AuthUtil;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SupportController {
    private final SupportRequestRepository supportRepo;
    private final AuthUtil authUtil;

    public SupportController(SupportRequestRepository supportRepo, AuthUtil authUtil) {
        this.supportRepo = supportRepo;
        this.authUtil = authUtil;
    }

    @PostMapping("/support/requests")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> create(@RequestHeader("Authorization") String authHeader,
                                      @RequestBody RequestDtos.SupportRequestBody req) {
        SupportRequest s = new SupportRequest();
        s.setRequesterName(req.name == null ? "" : req.name.trim());
        s.setRequesterEmail(req.email == null ? "" : req.email.trim());
        s.setServiceType(req.serviceType == null ? "General Inquiry" : req.serviceType.trim());
        s.setMessage(req.message == null ? "" : req.message.trim());
        s.setSubmittedByEmail(authUtil.emailFromHeader(authHeader));
        supportRepo.save(s);
        return Map.of("message", "Request submitted");
    }

    @GetMapping("/admin/support/requests")
    public List<SupportRequest> listAdmin() {
        return supportRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}

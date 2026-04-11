package com.studenthealth.backend.controller;

import com.studenthealth.backend.entity.ActivityEvent;
import com.studenthealth.backend.repository.ActivityEventRepository;
import com.studenthealth.backend.repository.HealthResourceRepository;
import com.studenthealth.backend.repository.UserAccountRepository;
import com.studenthealth.backend.repository.WellnessProgramRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
public class AdminAnalyticsController {
    private final UserAccountRepository userRepo;
    private final HealthResourceRepository resourceRepo;
    private final WellnessProgramRepository programRepo;
    private final ActivityEventRepository eventRepo;

    public AdminAnalyticsController(UserAccountRepository userRepo,
                                    HealthResourceRepository resourceRepo,
                                    WellnessProgramRepository programRepo,
                                    ActivityEventRepository eventRepo) {
        this.userRepo = userRepo;
        this.resourceRepo = resourceRepo;
        this.programRepo = programRepo;
        this.eventRepo = eventRepo;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return Map.of(
                "totalUsers", userRepo.count(),
                "activeResources", resourceRepo.countByStatus("ACTIVE"),
                "activePrograms", programRepo.countByStatus("ACTIVE"),
                "totalSessions", eventRepo.count(),
                "mentalHealthAccess", eventRepo.countByActionTypeAndDetailContainingIgnoreCase("RESOURCE_ACCESS", "Mental Health"),
                "fitnessAccess", eventRepo.countByActionTypeAndDetailContainingIgnoreCase("RESOURCE_ACCESS", "Fitness"),
                "nutritionAccess", eventRepo.countByActionTypeAndDetailContainingIgnoreCase("RESOURCE_ACCESS", "Nutrition")
        );
    }

    @GetMapping("/recent")
    public List<ActivityEvent> recent(@RequestParam(defaultValue = "30") int limit) {
        int safe = Math.max(1, Math.min(100, limit));
        return eventRepo.findByOrderByAtDesc(PageRequest.of(0, safe));
    }
}

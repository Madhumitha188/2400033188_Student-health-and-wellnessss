package com.studenthealth.backend.repository;

import com.studenthealth.backend.entity.HealthResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthResourceRepository extends JpaRepository<HealthResource, Long> {
    List<HealthResource> findByStatusOrderByIdDesc(String status);
    long countByStatus(String status);
    long countByCategoryIgnoreCase(String category);
}

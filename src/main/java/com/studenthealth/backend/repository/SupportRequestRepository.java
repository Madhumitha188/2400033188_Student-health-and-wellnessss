package com.studenthealth.backend.repository;

import com.studenthealth.backend.entity.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {
}

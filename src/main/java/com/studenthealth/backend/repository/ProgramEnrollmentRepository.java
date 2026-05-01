package com.studenthealth.backend.repository;

import com.studenthealth.backend.entity.ProgramEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramEnrollmentRepository extends JpaRepository<ProgramEnrollment, Long> {
    boolean existsByUserEmailIgnoreCaseAndProgramId(String email, Long programId);
    long countByProgramId(Long programId);
    void deleteByProgramId(Long programId);
}

package com.studenthealth.backend.repository;

import com.studenthealth.backend.entity.WellnessProgram;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WellnessProgramRepository extends JpaRepository<WellnessProgram, Long> {
    List<WellnessProgram> findByStatusOrderByIdDesc(String status);
    long countByStatus(String status);
}

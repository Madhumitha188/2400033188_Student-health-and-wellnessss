package com.studenthealth.backend.repository;

import com.studenthealth.backend.entity.ActivityEvent;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityEventRepository extends JpaRepository<ActivityEvent, Long> {
    List<ActivityEvent> findByOrderByAtDesc(Pageable pageable);
    long countByActionTypeAndDetailContainingIgnoreCase(String actionType, String detail);
}

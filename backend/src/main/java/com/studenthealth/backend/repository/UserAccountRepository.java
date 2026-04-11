package com.studenthealth.backend.repository;

import com.studenthealth.backend.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByEmailIgnoreCase(String email);
    long countByRoleIgnoreCase(String role);
}

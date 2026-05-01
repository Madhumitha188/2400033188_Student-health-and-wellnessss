package com.studenthealth.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "program_enrollments", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_program", columnNames = {"user_id", "program_id"})
})
public class ProgramEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private UserAccount user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "program_id")
    private WellnessProgram program;

    @Column(nullable = false)
    private LocalDateTime enrolledAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserAccount getUser() { return user; }
    public void setUser(UserAccount user) { this.user = user; }
    public WellnessProgram getProgram() { return program; }
    public void setProgram(WellnessProgram program) { this.program = program; }
    public LocalDateTime getEnrolledAt() { return enrolledAt; }
    public void setEnrolledAt(LocalDateTime enrolledAt) { this.enrolledAt = enrolledAt; }
}

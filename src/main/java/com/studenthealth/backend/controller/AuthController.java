package com.studenthealth.backend.controller;

import com.studenthealth.backend.dto.AuthDtos;
import com.studenthealth.backend.entity.UserAccount;
import com.studenthealth.backend.repository.UserAccountRepository;
import com.studenthealth.backend.util.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserAccountRepository userRepo;
    private final AuthUtil authUtil;

    public AuthController(UserAccountRepository userRepo, AuthUtil authUtil) {
        this.userRepo = userRepo;
        this.authUtil = authUtil;
    }

    @PostMapping("/login")
    public AuthDtos.AuthResponse login(@RequestBody AuthDtos.LoginRequest req) {
        if (req == null || req.email == null || req.password == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }
        UserAccount user = userRepo.findByEmailIgnoreCase(req.email.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!user.getPassword().equals(req.password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        String token = authUtil.tokenFor(user.getEmail(), user.getRole());
        return new AuthDtos.AuthResponse(token, user.getEmail(), user.getName(), user.getRole());
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthDtos.AuthResponse signup(@RequestBody AuthDtos.SignupRequest req) {
        if (req == null || blank(req.email) || blank(req.password)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }
        if (userRepo.findByEmailIgnoreCase(req.email.trim()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists. Please log in.");
        }

        UserAccount user = new UserAccount();
        user.setName(blank(req.name) ? "New Student" : req.name.trim());
        user.setEmail(req.email.trim().toLowerCase());
        user.setPassword(req.password);
        user.setPhone(blank(req.phone) ? null : req.phone.trim());
        user.setRole("STUDENT");
        user = userRepo.save(user);

        String token = authUtil.tokenFor(user.getEmail(), user.getRole());
        return new AuthDtos.AuthResponse(token, user.getEmail(), user.getName(), user.getRole());
    }

    private boolean blank(String s) {
        return s == null || s.trim().isEmpty();
    }
}

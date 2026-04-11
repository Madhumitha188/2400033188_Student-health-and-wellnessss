package com.studenthealth.backend.controller;

import com.studenthealth.backend.dto.AuthDtos;
import com.studenthealth.backend.entity.UserAccount;
import com.studenthealth.backend.repository.UserAccountRepository;
import com.studenthealth.backend.util.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserAccountRepository userRepo;
    private final AuthUtil authUtil;

    public UserController(UserAccountRepository userRepo, AuthUtil authUtil) {
        this.userRepo = userRepo;
        this.authUtil = authUtil;
    }

    @GetMapping("/users/me")
    public UserAccount getMe(@RequestHeader("Authorization") String authHeader) {
        String email = authUtil.emailFromHeader(authHeader);
        UserAccount user = userRepo.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        user.setPassword("***");
        return user;
    }

    @PutMapping("/users/me")
    public UserAccount updateMe(@RequestHeader("Authorization") String authHeader,
                                @RequestBody AuthDtos.ProfileRequest req) {
        String email = authUtil.emailFromHeader(authHeader);
        UserAccount user = userRepo.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (req.name != null && !req.name.trim().isEmpty()) {
            user.setName(req.name.trim());
        }
        if (req.phone != null) {
            String p = req.phone.trim();
            user.setPhone(p.isEmpty() ? null : p);
        }
        user = userRepo.save(user);
        user.setPassword("***");
        return user;
    }

    @GetMapping("/admin/users")
    public List<Map<String, Object>> getUsers() {
        return userRepo.findAll().stream().map(u -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", u.getId());
            row.put("name", u.getName());
            row.put("email", u.getEmail());
            row.put("phone", u.getPhone());
            row.put("role", u.getRole());
            row.put("createdAt", u.getCreatedAt());
            return row;
        }).toList();
    }
}

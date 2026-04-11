package com.studenthealth.backend.util;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.Base64;

@Component
public class AuthUtil {

    public String tokenFor(String email, String role) {
        String raw = (email + "|" + role).toLowerCase();
        return Base64.getUrlEncoder().withoutPadding().encodeToString(raw.getBytes());
    }

    public String emailFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing auth token");
        }
        String token = authHeader.substring("Bearer ".length());
        try {
            String raw = new String(Base64.getUrlDecoder().decode(token));
            String[] parts = raw.split("\\|");
            if (parts.length < 1 || parts[0].isBlank()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
            }
            return parts[0].trim().toLowerCase();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
    }
}

package com.studenthealth.backend.dto;

public class AuthDtos {
    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class SignupRequest {
        public String name;
        public String email;
        public String password;
        public String phone;
    }

    public static class ProfileRequest {
        public String name;
        public String phone;
    }

    public static class AuthResponse {
        public String token;
        public String email;
        public String name;
        public String role;

        public AuthResponse(String token, String email, String name, String role) {
            this.token = token;
            this.email = email;
            this.name = name;
            this.role = role;
        }
    }
}

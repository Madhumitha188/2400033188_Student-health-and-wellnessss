package com.studenthealth.backend.dto;

import java.time.LocalDate;

public class RequestDtos {
    public static class ResourceRequest {
        public String title;
        public String category;
        public String description;
        public String contactEmail;
        public String phone;
    }

    public static class ProgramRequest {
        public String name;
        public String type;
        public String description;
        public String duration;
        public LocalDate startDate;
    }

    public static class SupportRequestBody {
        public String name;
        public String email;
        public String serviceType;
        public String message;
    }
}

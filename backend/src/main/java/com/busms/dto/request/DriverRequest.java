package com.busms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record DriverRequest(
        @NotBlank(message = "Name is required") String name,
        @NotBlank(message = "License number is required") String licenseNumber,
        @NotBlank
        @Pattern(regexp = "^[0-9+\\-\\s]{7,20}$", message = "Phone must be a valid number")
        String phone,
        boolean available
) {}

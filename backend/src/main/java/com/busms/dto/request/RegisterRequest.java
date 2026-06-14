package com.busms.dto.request;

import com.busms.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(min = 3, max = 50) String username,
        @NotBlank @Size(max = 100) String fullName,
        @NotBlank @Size(min = 6, max = 100) String password,
        @NotNull Role role
) {}

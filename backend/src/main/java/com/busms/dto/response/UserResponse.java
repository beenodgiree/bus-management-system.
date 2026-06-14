package com.busms.dto.response;

import com.busms.entity.Role;

public record UserResponse(
        Long id,
        String username,
        String fullName,
        Role role,
        boolean enabled
) {}

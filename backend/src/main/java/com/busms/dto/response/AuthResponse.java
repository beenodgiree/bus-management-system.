package com.busms.dto.response;

import com.busms.entity.Role;

public record AuthResponse(
        String token,
        String tokenType,
        String username,
        String fullName,
        Role role
) {}

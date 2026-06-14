package com.busms.mapper;

import com.busms.dto.response.UserResponse;
import com.busms.entity.User;

public final class UserMapper {
    private UserMapper() {}

    public static UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getUsername(), u.getFullName(), u.getRole(), u.isEnabled());
    }
}

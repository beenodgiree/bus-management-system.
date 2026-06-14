package com.busms.service;

import com.busms.dto.request.LoginRequest;
import com.busms.dto.request.RegisterRequest;
import com.busms.dto.response.AuthResponse;
import com.busms.dto.response.UserResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    UserResponse register(RegisterRequest request);
}

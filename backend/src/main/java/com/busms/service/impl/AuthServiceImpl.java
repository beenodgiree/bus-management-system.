package com.busms.service.impl;

import com.busms.dto.request.LoginRequest;
import com.busms.dto.request.RegisterRequest;
import com.busms.dto.response.AuthResponse;
import com.busms.dto.response.UserResponse;
import com.busms.entity.User;
import com.busms.exception.DuplicateResourceException;
import com.busms.mapper.UserMapper;
import com.busms.repository.UserRepository;
import com.busms.security.JwtService;
import com.busms.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtService jwtService,
                           UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Throws BadCredentialsException (handled globally) if invalid.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        User user = userRepository.findByUsername(request.username()).orElseThrow();
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
        Map<String, Object> claims = Map.of(
                "fullName", user.getFullName(),
                "role", user.getRole().name());
        String token = jwtService.generateToken(userDetails, claims);

        return new AuthResponse(token, "Bearer", user.getUsername(), user.getFullName(), user.getRole());
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username already taken: " + request.username());
        }
        User user = User.builder()
                .username(request.username())
                .fullName(request.fullName())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .enabled(true)
                .build();
        return UserMapper.toResponse(userRepository.save(user));
    }
}

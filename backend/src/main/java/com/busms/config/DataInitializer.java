package com.busms.config;

import com.busms.entity.Role;
import com.busms.entity.User;
import com.busms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds default accounts on startup so the app is usable immediately.
 * Passwords are BCrypt-hashed here (data.sql cannot hash), then other
 * sample data is loaded by database/data.sql.
 *
 *   admin / admin123  (ADMIN)
 *   staff / staff123  (STAFF)
 *
 * Disabled under the "test" profile.
 */
@Component
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seed("admin", "System Administrator", "admin123", Role.ADMIN);
        seed("staff", "Front Desk Staff", "staff123", Role.STAFF);
    }

    private void seed(String username, String fullName, String rawPassword, Role role) {
        if (userRepository.existsByUsername(username)) {
            return;
        }
        userRepository.save(User.builder()
                .username(username)
                .fullName(fullName)
                .password(passwordEncoder.encode(rawPassword))
                .role(role)
                .enabled(true)
                .build());
    }
}

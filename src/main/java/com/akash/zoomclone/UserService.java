package com.akash.zoomclone;

import com.akash.zoomclone.config.JwtService;
import com.akash.zoomclone.user.dto.AuthResponse;
import com.akash.zoomclone.user.dto.LoginRequest;
import com.akash.zoomclone.user.dto.RegisterRequest;
import com.akash.zoomclone.user.dto.UserPublicDto;
import com.akash.zoomclone.exception.DuplicateUserException;
import com.akash.zoomclone.exception.InvalidCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        String username = request.username().trim();

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateUserException("An account with this email already exists.");
        }
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateUserException("This username is already taken.");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .status("online")
                .role(Role.USER)
                .build();

        user = userRepository.save(user);
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        user.setStatus("online");
        user = userRepository.save(user);
        return buildAuthResponse(user);
    }

    @Transactional
    public void logout() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            user.setStatus("offline");
            userRepository.save(user);
        }
    }

    @Transactional(readOnly = true)
    public List<UserPublicDto> findAllPublic() {
        return userRepository.findAll().stream()
                .map(UserPublicDto::fromEntity)
                .toList();
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user);
        return AuthResponse.of(token, UserPublicDto.fromEntity(user));
    }
}

package com.akash.zoomclone.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Username is required")
        @Size(min = 2, max = 64, message = "Username must be 2–64 characters")
        String username,
        @NotBlank(message = "Email is required")
        @Email(message = "Valid email is required")
        String email,
        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 72, message = "Password must be 8–72 characters")
        String password
) {
}

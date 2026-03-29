package com.akash.zoomclone.user.dto;

import com.akash.zoomclone.Role;
import com.akash.zoomclone.User;

public record UserPublicDto(
        Long id,
        String username,
        String email,
        String status,
        Role role
) {
    public static UserPublicDto fromEntity(User user) {
        return new UserPublicDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getStatus(),
                user.getRole()
        );
    }
}

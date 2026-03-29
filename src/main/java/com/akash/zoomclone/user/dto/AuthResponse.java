package com.akash.zoomclone.user.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        UserPublicDto user
) {
    public static AuthResponse of(String accessToken, UserPublicDto user) {
        return new AuthResponse(accessToken, "Bearer", user);
    }
}

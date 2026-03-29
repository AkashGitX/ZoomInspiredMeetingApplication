package com.akash.zoomclone.user.dto;

public record ApiErrorResponse(
        String error,
        String message
) {
}

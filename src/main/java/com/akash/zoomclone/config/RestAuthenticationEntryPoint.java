package com.akash.zoomclone.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * JSON 401 responses for unauthenticated API access. Wired into {@link org.springframework.security.web.SecurityFilterChain}
 * when you add {@code .exceptionHandling(e -> e.authenticationEntryPoint(...))} and secured routes.
 * <p>
 * Requires {@code spring-security-web} on the classpath (included by {@code spring-boot-starter-security}; also declared explicitly in pom.xml).
 */
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final byte[] BODY =
            "{\"error\":\"UNAUTHORIZED\",\"message\":\"Authentication required or token is invalid.\"}"
                    .getBytes(StandardCharsets.UTF_8);

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getOutputStream().write(BODY);
    }
}

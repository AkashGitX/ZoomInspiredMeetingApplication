package com.akash.zoomclone;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** Explicit DB column name avoids ambiguity if naming strategies change. */
    @Column(name = "username", nullable = false, unique = true, length = 64)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 128)
    private String email;

    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "status", nullable = false, length = 16)
    @Builder.Default
    private String status = "offline";

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 16)
    @Builder.Default
    private Role role = Role.USER;
}

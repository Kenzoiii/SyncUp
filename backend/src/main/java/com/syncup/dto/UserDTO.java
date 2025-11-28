package com.syncup.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
    private Boolean isActive;
    private LocalDateTime createdAt;
    // We can add more fields here later if the frontend needs them
}
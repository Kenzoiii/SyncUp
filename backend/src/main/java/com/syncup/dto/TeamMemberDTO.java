package com.syncup.dto;

import com.syncup.entity.TeamMember;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TeamMemberDTO {
    private Long userId;
    private String fullName;
    private String email;
    private TeamMember.Role role;
    private LocalDateTime joinedAt;
}
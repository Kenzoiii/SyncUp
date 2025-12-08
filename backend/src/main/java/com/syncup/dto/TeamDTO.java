package com.syncup.dto;

import com.syncup.entity.TeamMember;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamDTO {
    private Long id;
    private String teamName;
    private String description;
    private Long adminUserId;
    private TeamMember.Role role;
}

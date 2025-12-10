package com.syncup.dto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamDTO {
    private Long id;
    private String teamName;
    private String description;
    private Long adminUserId;
}
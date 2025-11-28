package com.syncup.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class ProjectDTO {
    private Long id;
    private String projectName;
    private String description;
    private String status;
    private Integer progressPercentage;
    private Long teamId;
    private boolean isAdmin; // Calculated field
    private LocalDate startDate;
}
package com.syncup.dto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDTO {
    private String scoreLevel;
    private Integer tasksCompleted;
    private Integer minutesOnline;
    private Long totalTasks;
    private Long completedTasks;
    private Long inProgressTasks;
    private Long taskCompletionRate;
    private Long totalProjects;
}
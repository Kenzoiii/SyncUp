package com.syncup.dto;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class TaskDTO {
    private Long id;
    private String taskName;
    private String description;
    private String priority;
    private String status;
    private LocalDate dueDate;
    private LocalDate startDate;
    private Long projectId;
    private Long assignedUserId;
    private String assignedUserName;
}
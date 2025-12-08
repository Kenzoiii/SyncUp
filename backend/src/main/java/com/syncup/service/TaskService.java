package com.syncup.service;

import com.syncup.dto.TaskDTO;
import com.syncup.entity.Project;
import com.syncup.entity.TeamMember;
import com.syncup.entity.Task;
import com.syncup.entity.User;
import com.syncup.repository.ProjectRepository;
import com.syncup.repository.TaskRepository;
import com.syncup.repository.TeamMemberRepository;
import com.syncup.repository.TeamRepository;
import com.syncup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;

    public List<TaskDTO> getMyTasks(String email, Long teamId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Task> tasks;
        if (teamId != null) {
            boolean isMember = user.getTeamMemberships().stream()
                    .anyMatch(tm -> tm.getTeamId().equals(teamId));
            if (!isMember) {
                return List.of();
            }
            tasks = taskRepository.findByAssignedUserIdAndTeam(user.getId(), teamId);
        } else {
            tasks = taskRepository.findByAssignedUserId(user.getId());
        }

        return tasks.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDTO createTask(TaskDTO dto, String creatorEmail) {
        // Validate Project
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User creator = userRepository.findByEmail(creatorEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = teamMemberRepository.findByTeamIdAndUserId(project.getTeamId(), creator.getId())
            .map(tm -> tm.getRole() == TeamMember.Role.ADMIN)
            .orElse(false);

        boolean isTeamOwner = teamRepository.findById(project.getTeamId())
            .map(team -> team.getAdminUserId().equals(creator.getId()))
            .orElse(false);

        if (!isAdmin && !isTeamOwner) {
            throw new RuntimeException("Only team admins or the team owner can add tasks to this project");
        }

        Task task = Task.builder()
                .taskName(dto.getTaskName())
            .description(dto.getDescription())
                .projectId(project.getId())
                .status(Task.Status.TODO)
                .priority(Task.Priority.valueOf(dto.getPriority())) // Ensure DTO sends valid Enum string
                .startDate(dto.getStartDate())
                .dueDate(dto.getDueDate())
                .build();

        // Handle assignment if provided
        if (dto.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(dto.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            task.setAssignedUserId(assignedUser.getId());
        }

        Task savedTask = taskRepository.save(task);
        return mapToDTO(savedTask);
    }

    private TaskDTO mapToDTO(Task task) {
        String assignedName = null;
        if (task.getAssignedUser() != null) {
            assignedName = task.getAssignedUser().getFullName();
        }

        return TaskDTO.builder()
                .id(task.getId())
                .taskName(task.getTaskName())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .priority(task.getPriority().name())
                .dueDate(task.getDueDate())
                .startDate(task.getStartDate())
                .projectId(task.getProjectId())
                .assignedUserId(task.getAssignedUserId())
                .assignedUserName(assignedName)
                .build();
    }
}
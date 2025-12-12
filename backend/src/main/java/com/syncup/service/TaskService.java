package com.syncup.service;

import com.syncup.dto.TaskDTO;
import com.syncup.entity.Project;
import com.syncup.entity.Task;
import com.syncup.entity.User;
import com.syncup.repository.ProjectRepository;
import com.syncup.repository.TaskRepository;
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
    private final com.syncup.repository.TeamMemberRepository teamMemberRepository;

    public List<TaskDTO> getMyTasks(String email, Long activeTeamId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If a team is specified, ensure user is a member; otherwise return empty
        if (activeTeamId != null) {
            boolean isMember = teamMemberRepository.existsByTeamIdAndUserId(activeTeamId, user.getId());
            if (!isMember) {
                return List.of();
            }
        }

        // Fetch all assigned tasks
        List<Task> allTasks = taskRepository.findByAssignedUserId(user.getId());

        // FILTER: Only keep tasks where the Project's Team ID matches activeTeamId
        if (activeTeamId != null) {
            allTasks = allTasks.stream()
                    .filter(task -> task.getProject().getTeamId().equals(activeTeamId))
                    .collect(Collectors.toList());
        }

        return allTasks.stream()
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

    @Transactional
    public void deleteTask(Long taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new RuntimeException("Task not found");
        }
        taskRepository.deleteById(taskId);
    }

    @Transactional
    public TaskDTO submitTask(Long taskId, String submissionLink) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setSubmissionLink(submissionLink);
        task.setSubmitted(true);
        task.setSubmittedAt(java.time.LocalDateTime.now());
        // Auto-mark as COMPLETED on submission
        task.setStatus(Task.Status.COMPLETED);
        Task saved = taskRepository.save(task);
        return mapToDTO(saved);
    }

    @Transactional
    public TaskDTO unsubmitTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setSubmitted(false);
        task.setSubmittedAt(null);
        // Revert status back to IN_PROGRESS on unsubmit
        task.setStatus(Task.Status.IN_PROGRESS);
        Task saved = taskRepository.save(task);
        return mapToDTO(saved);
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
            .submissionLink(task.getSubmissionLink())
            .submitted(task.getSubmitted())
            .submittedAt(task.getSubmittedAt())
                .build();
    }
}
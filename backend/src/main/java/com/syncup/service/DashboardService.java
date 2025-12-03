package com.syncup.service;

import com.syncup.dto.DashboardStatsDTO;
import com.syncup.entity.Task;
import com.syncup.entity.User;
import com.syncup.entity.UserScore;
import com.syncup.repository.ProjectRepository;
import com.syncup.repository.TaskRepository;
import com.syncup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public DashboardStatsDTO getUserStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Get Score (Handle null case safely)
        UserScore score = user.getUserScore();
        String level = (score != null) ? score.getLevel() : "A+";
        int tasksCompleted = (score != null) ? score.getTasksCompleted() : 0;
        int minutesOnline = (score != null) ? score.getMinutesOnline() : 0;

        // 2. Efficient DB Counts (Fast!)
        long totalTasks = taskRepository.count(); // In a real app, you might want to filter by user's team/projects
        long completedTasksCount = taskRepository.countByStatus(Task.Status.COMPLETED);
        long inProgressTasksCount = taskRepository.countByStatus(Task.Status.IN_PROGRESS);
        long totalProjects = projectRepository.count();

        // 3. Calculate Rate
        long completionRate = (totalTasks > 0) ? (completedTasksCount * 100 / totalTasks) : 0;

        return DashboardStatsDTO.builder()
                .scoreLevel(level)
                .tasksCompleted(tasksCompleted)
                .minutesOnline(minutesOnline)
                .totalTasks(totalTasks)
                .completedTasks(completedTasksCount)
                .inProgressTasks(inProgressTasksCount)
                .taskCompletionRate(completionRate)
                .totalProjects(totalProjects)
                .build();
    }
}
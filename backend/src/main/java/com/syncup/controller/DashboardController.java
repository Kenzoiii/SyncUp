package com.syncup.controller;

import com.syncup.entity.User;
import com.syncup.entity.UserScore;
import com.syncup.repository.UserRepository;
import com.syncup.repository.ProjectRepository;
import com.syncup.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        
        Map<String, Object> stats = new HashMap<>();
        
        // Get user score
        UserScore userScore = user != null ? user.getUserScore() : null;
        if (userScore != null) {
            stats.put("score", userScore.getLevel());
            stats.put("tasksCompleted", userScore.getTasksCompleted());
            stats.put("minutesOnline", userScore.getMinutesOnline());
        } else {
            stats.put("score", "A+");
            stats.put("tasksCompleted", 0);
            stats.put("minutesOnline", 0);
        }
        
        // Get task statistics
        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.findByStatus(com.syncup.entity.Task.Status.COMPLETED).size();
        long inProgressTasks = taskRepository.findByStatus(com.syncup.entity.Task.Status.IN_PROGRESS).size();
        
        stats.put("totalTasks", totalTasks);
        stats.put("completedTasks", completedTasks);
        stats.put("inProgressTasks", inProgressTasks);
        stats.put("taskCompletionRate", totalTasks > 0 ? (completedTasks * 100) / totalTasks : 0);
        
        // Get project statistics
        long totalProjects = projectRepository.count();
        stats.put("totalProjects", totalProjects);
        
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/projects")
    public ResponseEntity<?> getProjects(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        
        // Get projects for user's teams
        // This would need to be implemented based on team relationships
        return ResponseEntity.ok(projectRepository.findAll());
    }
    
    @GetMapping("/tasks")
    public ResponseEntity<?> getTasks(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        
        // Get tasks assigned to user
        return ResponseEntity.ok(user != null ? taskRepository.findByAssignedUserId(user.getId()) : new Object[]{});
    }
}

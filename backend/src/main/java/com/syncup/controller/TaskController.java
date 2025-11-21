package com.syncup.controller;

import com.syncup.entity.Task;
import com.syncup.entity.User;
import com.syncup.repository.TaskRepository;
import com.syncup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my-tasks")
    public ResponseEntity<?> getMyTasks(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = principal.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        // Get all tasks assigned to the user
        List<Task> tasks = taskRepository.findAll().stream()
                .filter(t -> t.getAssignedUserId() != null && t.getAssignedUserId().equals(user.getId()))
                .collect(Collectors.toList());

        List<Map<String, Object>> taskData = tasks.stream().map(task -> {
            Map<String, Object> data = new HashMap<>();
            data.put("id", task.getId());
            data.put("taskName", task.getTaskName());
            data.put("description", task.getDescription());
            data.put("priority", task.getPriority());
            data.put("status", task.getStatus());
            data.put("dueDate", task.getDueDate());
            data.put("startDate", task.getStartDate());
            data.put("projectId", task.getProjectId());
            return data;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(taskData);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getProjectTasks(@PathVariable Long projectId) {
        List<Task> tasks = taskRepository.findAll().stream()
                .filter(t -> t.getProjectId().equals(projectId))
                .collect(Collectors.toList());

        List<Map<String, Object>> taskData = tasks.stream().map(task -> {
            Map<String, Object> data = new HashMap<>();
            data.put("id", task.getId());
            data.put("taskName", task.getTaskName());
            data.put("description", task.getDescription());
            data.put("priority", task.getPriority());
            data.put("status", task.getStatus());
            data.put("dueDate", task.getDueDate());
            data.put("startDate", task.getStartDate());
            data.put("assignedUserId", task.getAssignedUserId());
            
            // Get assigned user info
            if (task.getAssignedUserId() != null) {
                User assignedUser = userRepository.findById(task.getAssignedUserId()).orElse(null);
                if (assignedUser != null) {
                    data.put("assignedUserName", assignedUser.getFullName());
                }
            }
            
            return data;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(taskData);
    }
}


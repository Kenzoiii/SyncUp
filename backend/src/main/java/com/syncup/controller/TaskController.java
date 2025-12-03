package com.syncup.controller;

import com.syncup.dto.TaskDTO;
import com.syncup.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/my-tasks")
    public ResponseEntity<List<TaskDTO>> getMyTasks(Authentication auth) {
        return ResponseEntity.ok(taskService.getMyTasks(auth.getName()));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskDTO>> getProjectTasks(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId));
    }

    // Example of how easy it is to add new features now:
    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDto, Authentication auth) {
        return ResponseEntity.ok(taskService.createTask(taskDto, auth.getName()));
    }
}
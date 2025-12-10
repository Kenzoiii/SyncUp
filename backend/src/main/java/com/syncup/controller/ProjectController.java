package com.syncup.controller;

import com.syncup.dto.ProjectDTO;
import com.syncup.dto.TeamMemberDTO;
import com.syncup.dto.UserSummaryDTO;
import com.syncup.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProjectController {

    private final ProjectService projectService;

    // FIX IS HERE: Added @RequestParam Long teamId
    @GetMapping("/my-projects")
    public ResponseEntity<List<ProjectDTO>> getMyProjects(
            Authentication auth,
            @RequestParam(required = false) Long teamId
    ) {
        // Pass BOTH arguments to the service
        return ResponseEntity.ok(projectService.getProjectsForUser(auth.getName(), teamId));
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO, Authentication auth) {
        return ResponseEntity.ok(projectService.createProject(projectDTO, auth.getName()));
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<TeamMemberDTO>> getProjectMembers(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getProjectMembers(projectId));
    }

    @PostMapping("/{projectId}/add-member")
    public ResponseEntity<Map<String, String>> addMemberToProject(
            @PathVariable Long projectId,
            @RequestBody Map<String, String> request,
            Authentication auth
    ) {
        String emailToAdd = request.get("email");
        projectService.addMember(projectId, emailToAdd, auth.getName());
        return ResponseEntity.ok(Map.of("message", "User added successfully"));
    }

    @GetMapping("/search-users")
    public ResponseEntity<List<UserSummaryDTO>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(projectService.searchUsers(query));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable Long projectId, Authentication auth) {
        try {
            projectService.deleteProject(projectId, auth.getName());
            return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
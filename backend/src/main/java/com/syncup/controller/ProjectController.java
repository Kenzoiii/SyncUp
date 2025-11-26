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
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/my-projects")
    public ResponseEntity<List<ProjectDTO>> getMyProjects(Authentication auth) {
        return ResponseEntity.ok(projectService.getProjectsForUser(auth.getName()));
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
}
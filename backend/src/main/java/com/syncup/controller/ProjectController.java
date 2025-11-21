package com.syncup.controller;

import com.syncup.entity.Project;
import com.syncup.entity.Team;
import com.syncup.entity.TeamMember;
import com.syncup.entity.User;
import com.syncup.repository.ProjectRepository;
import com.syncup.repository.TeamMemberRepository;
import com.syncup.repository.TeamRepository;
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
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @GetMapping("/my-projects")
    public ResponseEntity<?> getMyProjects(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = principal.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        // Get all teams the user is a member of
        List<TeamMember> teamMemberships = user.getTeamMemberships();
        List<Long> teamIds = teamMemberships.stream()
                .map(TeamMember::getTeamId)
                .collect(Collectors.toList());

        // Get all projects from those teams
        List<Project> projects = projectRepository.findAll().stream()
                .filter(p -> teamIds.contains(p.getTeamId()))
                .collect(Collectors.toList());

        // Check if user is admin of each project's team
        List<Map<String, Object>> projectData = projects.stream().map(project -> {
            Map<String, Object> data = new HashMap<>();
            data.put("id", project.getId());
            data.put("projectName", project.getProjectName());
            data.put("description", project.getDescription());
            data.put("status", project.getStatus());
            data.put("progressPercentage", project.getProgressPercentage());
            data.put("teamId", project.getTeamId());

            // Check if user is admin of this project's team
            TeamMember membership = teamMemberships.stream()
                    .filter(tm -> tm.getTeamId().equals(project.getTeamId()))
                    .findFirst()
                    .orElse(null);
            data.put("isAdmin", membership != null && membership.getRole() == TeamMember.Role.ADMIN);

            return data;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(projectData);
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<?> getProjectMembers(@PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            return ResponseEntity.status(404).body("Project not found");
        }

        Team team = teamRepository.findById(project.getTeamId()).orElse(null);
        if (team == null) {
            return ResponseEntity.status(404).body("Team not found");
        }

        List<Map<String, Object>> members = team.getMembers().stream().map(tm -> {
            User user = userRepository.findById(tm.getUserId()).orElse(null);
            if (user == null) return null;

            Map<String, Object> memberData = new HashMap<>();
            memberData.put("userId", user.getId());
            memberData.put("fullName", user.getFullName());
            memberData.put("email", user.getEmail());
            memberData.put("role", tm.getRole());
            return memberData;
        }).filter(m -> m != null).collect(Collectors.toList());

        return ResponseEntity.ok(members);
    }

    @PostMapping("/{projectId}/add-member")
    public ResponseEntity<?> addMemberToProject(@PathVariable Long projectId, @RequestBody Map<String, String> request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String email = principal.getName();
        User currentUser = userRepository.findByEmail(email).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            return ResponseEntity.status(404).body("Project not found");
        }

        // Check if current user is admin of the project's team
        TeamMember currentUserMembership = teamMemberRepository.findAll().stream()
                .filter(tm -> tm.getTeamId().equals(project.getTeamId()) && tm.getUserId().equals(currentUser.getId()))
                .findFirst()
                .orElse(null);

        if (currentUserMembership == null || currentUserMembership.getRole() != TeamMember.Role.ADMIN) {
            return ResponseEntity.status(403).body("Only admins can add members to projects");
        }

        // Find user to add
        String userEmail = request.get("email");
        User userToAdd = userRepository.findByEmail(userEmail.toLowerCase().trim()).orElse(null);
        if (userToAdd == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        // Check if user is already a member
        boolean alreadyMember = teamMemberRepository.findAll().stream()
                .anyMatch(tm -> tm.getTeamId().equals(project.getTeamId()) && tm.getUserId().equals(userToAdd.getId()));

        if (alreadyMember) {
            return ResponseEntity.status(400).body("User is already a member of this project's team");
        }

        // Add user to team
        TeamMember newMember = new TeamMember();
        newMember.setTeamId(project.getTeamId());
        newMember.setUserId(userToAdd.getId());
        newMember.setRole(TeamMember.Role.MEMBER);
        teamMemberRepository.save(newMember);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User added successfully");
        response.put("userId", userToAdd.getId());
        response.put("fullName", userToAdd.getFullName());
        response.put("email", userToAdd.getEmail());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search-users")
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        String searchTerm = query.toLowerCase().trim();
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getFullName().toLowerCase().contains(searchTerm) || 
                            u.getEmail().toLowerCase().contains(searchTerm))
                .limit(10)
                .collect(Collectors.toList());

        List<Map<String, Object>> results = users.stream().map(user -> {
            Map<String, Object> data = new HashMap<>();
            data.put("userId", user.getId());
            data.put("fullName", user.getFullName());
            data.put("email", user.getEmail());
            return data;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }
}


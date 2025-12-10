package com.syncup.controller;

import com.syncup.dto.TeamDTO;
import com.syncup.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.*;

import com.syncup.dto.TeamMemberDTO;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TeamController {

    private final TeamService teamService;

    @PostMapping("/create")
    public ResponseEntity<?> createTeam(@RequestBody Map<String, String> request, Authentication auth) {
        try {
            return ResponseEntity.ok(teamService.createTeam(
                    request.get("teamName"),
                    request.get("description"),
                    auth.getName()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinTeam(@RequestBody Map<String, String> request, Authentication auth) {
        try {
            return ResponseEntity.ok(teamService.joinTeam(
                    request.get("teamName"),
                    auth.getName()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    @GetMapping("/my-teams")
    public ResponseEntity<List<TeamDTO>> getMyTeams(Authentication auth) {
        return ResponseEntity.ok(teamService.getMyTeams(auth.getName()));
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<TeamMemberDTO>> getTeamMembers(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.getTeamMembers(teamId));
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long teamId, Authentication auth) {
        try {
            teamService.deleteTeam(teamId, auth.getName());
            return ResponseEntity.ok(Map.of("message", "Team deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
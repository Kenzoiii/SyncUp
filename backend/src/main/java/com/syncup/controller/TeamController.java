package com.syncup.controller;

import com.syncup.dto.TeamDTO;
import com.syncup.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TeamController {

    private final TeamService teamService;

    @GetMapping("/my-teams")
    public ResponseEntity<List<TeamDTO>> getMyTeams(Authentication authentication) {
        return ResponseEntity.ok(teamService.getMyTeams(authentication.getName()));
    }

    @PostMapping("/join")
    public ResponseEntity<TeamDTO> joinTeam(@RequestBody Map<String, String> body, Authentication authentication) {
        String code = body.get("code");
        if (code == null || code.trim().isEmpty()) {
            throw new RuntimeException("Team code is required");
        }
        return ResponseEntity.ok(teamService.joinTeam(authentication.getName(), code.trim()));
    }
}

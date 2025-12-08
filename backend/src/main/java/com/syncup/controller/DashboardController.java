package com.syncup.controller;

import com.syncup.dto.DashboardStatsDTO;
import com.syncup.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(@RequestParam(required = false) Long teamId, Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getUserStats(authentication.getName(), teamId));
    }
}
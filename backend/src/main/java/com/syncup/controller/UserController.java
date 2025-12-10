package com.syncup.controller;

import com.syncup.dto.UserDTO;
import com.syncup.dto.UpdateProfileRequest; // Keep if used elsewhere
import com.syncup.entity.User;
import com.syncup.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.syncup.repository.UserRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    private Long getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request, Authentication auth) {
        try {
            // FIX: Call updateProfileName
            userService.updateProfileName(getUserId(auth), request.get("fullName"));
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, Authentication auth) {
        try {
            // FIX: Call changePassword
            userService.changePassword(
                    getUserId(auth),
                    request.get("oldPassword"),
                    request.get("newPassword")
            );
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(Authentication auth) {
        return ResponseEntity.ok(userService.getCurrentUser(auth.getName()));
    }

    // Note: If you still need this endpoint for other updates, you can keep it,
    // but the /profile endpoint above handles the name change now.
    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody UpdateProfileRequest request, Authentication auth) {
        // You can refactor this later to use the specific methods too if needed
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check-name")
    public ResponseEntity<Map<String, Object>> checkName(@RequestParam("fullName") String fullName) {
        boolean exists = userRepository.existsByFullNameIgnoreCase(fullName);
        return ResponseEntity.ok(Map.of(
                "available", !exists,
                "message", exists ? "Name already in use" : "Name is available"
        ));
    }
}
package com.syncup.controller;

import com.syncup.dto.UpdateProfileRequest;
import com.syncup.dto.UserDTO;
import com.syncup.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(Authentication auth) {
        return ResponseEntity.ok(userService.getCurrentUser(auth.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateMe(
            @RequestBody UpdateProfileRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(userService.updateProfile(auth.getName(), request));
    }
}
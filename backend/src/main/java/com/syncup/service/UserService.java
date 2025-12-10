package com.syncup.service;

import com.syncup.dto.UserDTO;
import com.syncup.entity.User;
import com.syncup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO getCurrentUser(String email) {
        User user = getUser(email);
        return mapToDTO(user);
    }

    // 1. FIX: Specific method for updating just the name
    @Transactional
    public void updateProfileName(Long userId, String newFullName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (newFullName != null && !newFullName.trim().isEmpty()) {
            user.setFullName(newFullName.trim());
            userRepository.save(user);
        }
    }

    // 2. FIX: Add the missing Change Password logic
    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // A. Validate the Old Password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect!");
        }

        // B. Hash and Save the New Password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
package com.syncup.service;

import com.syncup.dto.AuthResponse;
import com.syncup.dto.LoginRequest;
import com.syncup.dto.RegisterRequest;
import com.syncup.entity.Team;
import com.syncup.entity.TeamMember;
import com.syncup.entity.User;
import com.syncup.entity.UserScore;
import com.syncup.repository.TeamMemberRepository;
import com.syncup.repository.TeamRepository;
import com.syncup.repository.UserRepository;
import com.syncup.repository.UserScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserScoreRepository userScoreRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        // 1. Standard Spring Security Authentication
        // This automatically checks password, locked accounts, etc.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Fetch User (We know they exist now)
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        // 3. Generate Token
        String token = jwtService.generateToken(user.getEmail());

        // 4. Get Team Info (Simplified)
        Team team = user.getTeamMemberships().stream()
                .map(TeamMember::getTeam)
                .findFirst()
                .orElse(null);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .teamId(team != null ? team.getId() : null)
                .teamName(team != null ? team.getTeamName() : null)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Validation
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }

        // 2. Create User
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .isActive(true)
                .build();
        user = userRepository.save(user);

        // 3. Create or Find Team
        User finalUser = user;
        Team team = teamRepository.findByTeamName(request.getTeamName())
                .orElseGet(() -> {
                    Team newTeam = new Team(); // We didn't add Builder to Team yet, so constructor is fine
                    newTeam.setTeamName(request.getTeamName());
                    newTeam.setDescription("Team created by " + request.getFullName());
                    newTeam.setAdminUserId(finalUser.getId());
                    return teamRepository.save(newTeam);
                });

        // 4. Add User to Team
        TeamMember membership = new TeamMember();
        membership.setTeamId(team.getId());
        membership.setUserId(user.getId());
        membership.setRole(TeamMember.Role.ADMIN);
        teamMemberRepository.save(membership);

        // 5. Initialize Score
        userScoreRepository.save(new UserScore(user.getId()));

        // 6. Return Response
        String token = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .teamId(team.getId())
                .teamName(team.getTeamName())
                .build();
    }
}
package com.syncup.service;

import com.syncup.dto.AuthResponse;
import com.syncup.dto.LoginRequest;
import com.syncup.dto.RegisterRequest;
import com.syncup.entity.Team;
import com.syncup.entity.TeamMember;
import com.syncup.entity.User;
import com.syncup.entity.UserScore;
import com.syncup.repository.TeamRepository;
import com.syncup.repository.TeamMemberRepository;
import com.syncup.repository.UserScoreRepository;
import com.syncup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private UserScoreRepository userScoreRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    public AuthResponse login(LoginRequest loginRequest) {
        // Normalize email (trim and lowercase)
        String email = loginRequest.getEmail() == null ? null : loginRequest.getEmail().trim().toLowerCase();

        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }
        
        User user = userOptional.get();
        
        // Check password (trim to avoid accidental spaces)
        String rawPassword = loginRequest.getPassword() == null ? "" : loginRequest.getPassword().trim();
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail());
        
        // Get user's team information
        Long teamId = null;
        String teamName = null;
        Optional<TeamMember> teamMember = user.getTeamMemberships().stream().findFirst();
        if (teamMember.isPresent()) {
            Team team = teamMember.get().getTeam();
            teamId = team.getId();
            teamName = team.getTeamName();
        }
        
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), teamId, teamName);
    }
    
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        // Normalize email
        String email = registerRequest.getEmail() == null ? null : registerRequest.getEmail().trim().toLowerCase();

        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already taken!");
        }
        
        // Validate password confirmation
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }
        
        // Create new user
        User user = new User();
        user.setEmail(email);
        String normalizedPassword = registerRequest.getPassword() == null ? "" : registerRequest.getPassword().trim();
        user.setPassword(passwordEncoder.encode(normalizedPassword));
        user.setFullName(registerRequest.getFullName());
        user = userRepository.save(user);
        
        // Create or find team
        Team team;
        Optional<Team> existingTeam = teamRepository.findByTeamName(registerRequest.getTeamName());
        if (existingTeam.isPresent()) {
            team = existingTeam.get();
            // TODO: Handle team invitation logic
        } else {
            team = new Team();
            team.setTeamName(registerRequest.getTeamName());
            team.setDescription("Team created by " + registerRequest.getFullName());
            team.setAdminUserId(user.getId());
            team = teamRepository.save(team);
        }
        
        // Add user to team
        TeamMember teamMember = new TeamMember();
        teamMember.setTeamId(team.getId());
        teamMember.setUserId(user.getId());
        teamMember.setRole(TeamMember.Role.ADMIN);
        teamMemberRepository.save(teamMember);
        
        // Create user score
        UserScore userScore = new UserScore(user.getId());
        userScoreRepository.save(userScore);
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail());
        
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), team.getId(), team.getTeamName());
    }
}

package com.syncup.service;

import com.syncup.dto.TeamDTO;
import com.syncup.entity.Team;
import com.syncup.entity.TeamMember;
import com.syncup.entity.User;
import com.syncup.repository.TeamMemberRepository;
import com.syncup.repository.TeamRepository;
import com.syncup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;
import java.util.List;

import com.syncup.dto.TeamMemberDTO;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    @Transactional
    public TeamDTO createTeam(String teamName, String description, String userEmail) {
        // SCENARIO 1: Create Team -> Team already exists
        if (teamRepository.findByTeamName(teamName).isPresent()) {
            throw new RuntimeException("This team name is already taken. Please choose another.");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = new Team();
        team.setTeamName(teamName);
        team.setDescription(description);
        team.setAdminUserId(user.getId());
        team = teamRepository.save(team);

        TeamMember member = TeamMember.builder()
                .teamId(team.getId())
                .userId(user.getId())
                .role(TeamMember.Role.ADMIN)
                .build();
        teamMemberRepository.save(member);

        return mapToDTO(team);
    }


    @Transactional
    public TeamDTO joinTeam(String teamName, String userEmail) {
        // SCENARIO 2: Join Team -> Team does not exist
        Team team = teamRepository.findByTeamName(teamName)
                .orElseThrow(() -> new RuntimeException("This team does not exist. Please check the spelling."));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // SCENARIO 3: Join Team -> Already a member
        if (teamMemberRepository.existsByTeamIdAndUserId(team.getId(), user.getId())) {
            throw new RuntimeException("You are already a member of this team!");
        }

        TeamMember member = TeamMember.builder()
                .teamId(team.getId())
                .userId(user.getId())
                .role(TeamMember.Role.MEMBER)
                .build();
        teamMemberRepository.save(member);

        return mapToDTO(team);
    }

    @Transactional
    public void deleteTeam(Long teamId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // Security Check: Only the Admin can delete the team
        if (!team.getAdminUserId().equals(user.getId())) {
            throw new RuntimeException("Only the Team Admin can delete this team.");
        }

        // Note: This assumes your Database is set to CASCADE delete.
        // If not, you might need to manually delete TeamMembers/Projects first.
        teamRepository.delete(team);
    }

    public List<TeamDTO> getMyTeams(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getTeamMemberships().stream()
                .map(tm -> {
                    Team t = tm.getTeam();
                    return TeamDTO.builder()
                            .id(t.getId())
                            .teamName(t.getTeamName())
                            .description(t.getDescription())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<TeamMemberDTO> getTeamMembers(Long teamId) {
        // Simple fetch using the existing Repository method
        return teamMemberRepository.findByTeamId(teamId).stream()
                .map(tm -> TeamMemberDTO.builder()
                        .userId(tm.getUserId())
                        .fullName(tm.getUser().getFullName())
                        .email(tm.getUser().getEmail())
                        .role(tm.getRole())
                        .joinedAt(tm.getJoinedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private TeamDTO mapToDTO(Team team) {
        return TeamDTO.builder()
                .id(team.getId())
                .teamName(team.getTeamName())
                .description(team.getDescription())
                .adminUserId(team.getAdminUserId()) // <-- MAP THIS FIELD
                .build();
    }
}
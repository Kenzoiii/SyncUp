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

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    public List<TeamDTO> getMyTeams(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TeamMember> memberships = teamMemberRepository.findByUserId(user.getId());
        List<Long> teamIds = memberships.stream().map(TeamMember::getTeamId).toList();
        if (teamIds.isEmpty()) return List.of();

        List<Team> teams = teamRepository.findAllById(teamIds);

        return memberships.stream().map(membership -> {
            Team team = teams.stream()
                    .filter(t -> t.getId().equals(membership.getTeamId()))
                    .findFirst()
                    .orElse(null);
            return TeamDTO.builder()
                    .id(membership.getTeamId())
                    .teamName(team != null ? team.getTeamName() : "")
                    .description(team != null ? team.getDescription() : null)
                    .adminUserId(team != null ? team.getAdminUserId() : null)
                    .role(membership.getRole())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public TeamDTO joinTeam(String email, String codeOrName) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Team> byId = Optional.empty();
        try {
            Long id = Long.parseLong(codeOrName);
            byId = teamRepository.findById(id);
        } catch (NumberFormatException ignored) {
        }

        Team team = byId.orElseGet(() -> teamRepository.findByTeamName(codeOrName)
                .orElseThrow(() -> new RuntimeException("Team code/name not found")));

        if (teamMemberRepository.existsByTeamIdAndUserId(team.getId(), user.getId())) {
            throw new RuntimeException("Already a member of this team");
        }

        TeamMember membership = TeamMember.builder()
                .teamId(team.getId())
                .userId(user.getId())
                .role(TeamMember.Role.MEMBER)
                .build();
        teamMemberRepository.save(membership);

        return TeamDTO.builder()
                .id(team.getId())
                .teamName(team.getTeamName())
                .description(team.getDescription())
                .adminUserId(team.getAdminUserId())
                .role(membership.getRole())
                .build();
    }
}

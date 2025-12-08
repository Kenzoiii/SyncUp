package com.syncup.service;

import com.syncup.dto.ProjectDTO;
import com.syncup.dto.TeamMemberDTO;
import com.syncup.dto.UserSummaryDTO;
import com.syncup.entity.Project;
import com.syncup.entity.Team;
import com.syncup.entity.TeamMember;
import com.syncup.entity.User;
import com.syncup.repository.ProjectRepository;
import com.syncup.repository.TeamMemberRepository;
import com.syncup.repository.TeamRepository;
import com.syncup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

        public List<ProjectDTO> getProjectsForUser(String email, Long teamFilter) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Get all Team IDs the user belongs to
        List<Long> teamIds = user.getTeamMemberships().stream()
                .map(TeamMember::getTeamId)
                .toList();

        if (teamIds.isEmpty()) return List.of();

                if (teamFilter != null && !teamIds.contains(teamFilter)) {
                        return List.of();
                }

        // 2. Fetch Projects in bulk (Optimized)
                List<Project> projects = (teamFilter != null)
                                ? projectRepository.findByTeamId(teamFilter)
                                : projectRepository.findByTeamIdIn(teamIds);

        // 3. Map to DTO
        return projects.stream().map(project -> {
            boolean isAdmin = user.getTeamMemberships().stream()
                    .anyMatch(tm -> tm.getTeamId().equals(project.getTeamId()) && tm.getRole() == TeamMember.Role.ADMIN);

            return ProjectDTO.builder()
                    .id(project.getId())
                    .projectName(project.getProjectName())
                    .description(project.getDescription())
                    .status(project.getStatus().name())
                    .progressPercentage(project.getProgressPercentage())
                    .teamId(project.getTeamId())
                    .startDate(project.getStartDate())
                    .isAdmin(isAdmin)
                    .build();
        }).collect(Collectors.toList());
    }

        @Transactional
        public ProjectDTO createProject(ProjectDTO dto, String email) {
                if (dto.getTeamId() == null) {
                        throw new RuntimeException("teamId is required to create a project");
                }

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                boolean isAdmin = teamMemberRepository.findByTeamIdAndUserId(dto.getTeamId(), user.getId())
                                .map(tm -> tm.getRole() == TeamMember.Role.ADMIN)
                                .orElse(false);

                Team team = teamRepository.findById(dto.getTeamId())
                                .orElseThrow(() -> new RuntimeException("Team not found"));

                if (!isAdmin && !user.getId().equals(team.getAdminUserId())) {
                        throw new RuntimeException("Only team admins can create projects");
                }

                Project project = Project.builder()
                                .projectName(dto.getProjectName())
                                .description(dto.getDescription())
                                .teamId(dto.getTeamId())
                                .status(Project.Status.ACTIVE)
                                .progressPercentage(dto.getProgressPercentage() != null ? dto.getProgressPercentage() : 0)
                                .startDate(dto.getStartDate())
                                .build();

                Project saved = projectRepository.save(project);

                return ProjectDTO.builder()
                                .id(saved.getId())
                                .projectName(saved.getProjectName())
                                .description(saved.getDescription())
                                .status(saved.getStatus().name())
                                .progressPercentage(saved.getProgressPercentage())
                                .teamId(saved.getTeamId())
                                .startDate(saved.getStartDate())
                                .isAdmin(true)
                                .build();
        }

    public List<TeamMemberDTO> getProjectMembers(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Team team = teamRepository.findById(project.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        return team.getMembers().stream()
                .map(member -> TeamMemberDTO.builder()
                        .userId(member.getUserId())
                        .fullName(member.getUser().getFullName()) // Assumes User is fetched eagerly or OSIV is on
                        .email(member.getUser().getEmail())
                        .role(member.getRole())
                        .joinedAt(member.getJoinedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void addMember(Long projectId, String emailToAdd, String requesterEmail) {
        // 1. Validation
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User requester = userRepository.findByEmail(requesterEmail).orElseThrow();

        // 2. Check Permission (Must be Admin of the team)
        boolean isRequesterAdmin = teamMemberRepository.findByTeamIdAndUserId(project.getTeamId(), requester.getId())
                .map(tm -> tm.getRole() == TeamMember.Role.ADMIN)
                .orElse(false);

        if (!isRequesterAdmin) {
            throw new RuntimeException("Only Team Admins can add members.");
        }

        // 3. Find User to Add
        User userToAdd = userRepository.findByEmail(emailToAdd)
                .orElseThrow(() -> new RuntimeException("User with email " + emailToAdd + " not found."));

        // 4. Check Duplicate
        if (teamMemberRepository.existsByTeamIdAndUserId(project.getTeamId(), userToAdd.getId())) {
            throw new RuntimeException("User is already a member of this team.");
        }

        // 5. Add Member
        TeamMember newMember = TeamMember.builder()
                .teamId(project.getTeamId())
                .userId(userToAdd.getId())
                .role(TeamMember.Role.MEMBER)
                .build();

        teamMemberRepository.save(newMember);
    }

    public List<UserSummaryDTO> searchUsers(String query) {
        if (query == null || query.trim().isEmpty()) return List.of();

        return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query)
                .stream()
                .limit(10)
                .map(user -> UserSummaryDTO.builder()
                        .userId(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .build())
                .collect(Collectors.toList());
    }
}
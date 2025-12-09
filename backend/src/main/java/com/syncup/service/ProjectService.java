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

    public List<ProjectDTO> getProjectsForUser(String email, Long activeTeamId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Project> projects;

        // FILTER LOGIC
        if (activeTeamId != null) {
            // Verify user belongs to this team (Security Check)
            boolean isMember = user.getTeamMemberships().stream()
                    .anyMatch(tm -> tm.getTeamId().equals(activeTeamId));

            if (!isMember) {
                // If they try to access a team they aren't in, return empty or throw error
                return List.of();
            }
            // Fetch ONLY projects for this team
            projects = projectRepository.findByTeamId(activeTeamId);
        } else {
            // Fallback: Fetch everything (old behavior)
            List<Long> teamIds = user.getTeamMemberships().stream()
                    .map(TeamMember::getTeamId)
                    .toList();
            if (teamIds.isEmpty()) return List.of();
            projects = projectRepository.findByTeamIdIn(teamIds);
        }

        // Map to DTO (Same as before)
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
    public ProjectDTO createProject(ProjectDTO projectDTO, String ownerEmail) {
        User user = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Verify user belongs to the team they are creating a project for
        boolean isMember = teamMemberRepository.findByTeamIdAndUserId(projectDTO.getTeamId(), user.getId()).isPresent();
        if (!isMember) {
            throw new RuntimeException("You are not a member of this team.");
        }

        // 2. Create the Project Entity
        Project project = Project.builder()
                .projectName(projectDTO.getProjectName())
                .description(projectDTO.getDescription())
                .teamId(projectDTO.getTeamId())
                .status(Project.Status.ACTIVE)
                .progressPercentage(0)
                .startDate(projectDTO.getStartDate() != null ? projectDTO.getStartDate() : java.time.LocalDate.now())
                .build();

        Project savedProject = projectRepository.save(project);

        // 3. Return DTO
        return ProjectDTO.builder()
                .id(savedProject.getId())
                .projectName(savedProject.getProjectName())
                .description(savedProject.getDescription())
                .status(savedProject.getStatus().name())
                .progressPercentage(savedProject.getProgressPercentage())
                .teamId(savedProject.getTeamId())
                .startDate(savedProject.getStartDate())
                .isAdmin(true) // The creator is effectively an admin
                .build();
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

    @Transactional
    public void deleteProject(Long projectId, String userEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Security Check: Is the user an Admin of the team this project belongs to?
        boolean isAdmin = teamMemberRepository.findByTeamIdAndUserId(project.getTeamId(), user.getId())
                .map(tm -> tm.getRole() == TeamMember.Role.ADMIN)
                .orElse(false);

        if (!isAdmin) {
            throw new RuntimeException("Only Team Admins can delete projects.");
        }

        projectRepository.delete(project);
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
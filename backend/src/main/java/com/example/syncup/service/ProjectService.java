package com.example.syncup.service;

import com.example.syncup.entity.Project;
import com.example.syncup.entity.Team;
import com.example.syncup.repository.ProjectRepository;
import com.example.syncup.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private TeamRepository teamRepository; // To link a project to a team

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(int id) {
        return projectRepository.findById(id).orElse(null);
    }

    public Project createProject(Project project, int teamId) {
        Team team = teamRepository.findById(teamId).orElse(null);
        if (team == null) {
            return null;
        }
        project.setTeam(team);
        return projectRepository.save(project);
    }

    public Project updateProject(int id, Project projectDetails) {
        Project project = projectRepository.findById(id).orElse(null);
        if (project != null) {
            project.setProject_name(projectDetails.getProject_name());
            project.setDescription(projectDetails.getDescription());
            return projectRepository.save(project);
        }
        return null;
    }

    public void deleteProject(int id) {
        projectRepository.deleteById(id);
    }
}

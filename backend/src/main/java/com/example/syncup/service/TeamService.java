package com.example.syncup.service;

import com.example.syncup.entity.Team;
import com.example.syncup.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    // Example method: Save a new team
    public Team saveTeam(Team team) {
        return teamRepository.save(team);
    }

    // Example method: Get all teams
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }
}
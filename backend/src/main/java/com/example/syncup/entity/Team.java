package com.example.syncup.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "team") 
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer teamId;

    @Column(name = "team_name", length = 100)
    private String teamName; 

    @Column(columnDefinition = "TEXT")
    private String description; 
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    private List<User> users; 
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    private List<Project> projects; 
    public Integer getTeamId() {
        return teamId;
    }
    public void setTeamId(Integer teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }
    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public List<User> getUsers() {
        return users;
    }
    public void setUsers(List<User> users) {
        this.users = users;
    }

    public List<Project> getProjects() {
        return projects;
    }
    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }
}
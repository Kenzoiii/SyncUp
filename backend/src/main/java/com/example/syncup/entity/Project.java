package com.example.syncup.entity;
//test
import jakarta.persistence.*;

@Entity
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int project_id;

    @Column(nullable = false)
    private String project_name;

    private String description;


    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;


    public int getProject_id() {
        return project_id;
    }

    public String getProject_name() {
        return project_name;
    }

    public String getDescription() {
        return description;
    }

    public Team getTeam() {
        return team;
    }

    public void setProject_id(int project_id) {
        this.project_id = project_id;
    }

    public void setProject_name(String project_name) {
        this.project_name = project_name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
}

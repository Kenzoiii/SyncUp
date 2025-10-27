package com.example.syncup.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "check_in")
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer checkInId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(columnDefinition = "TEXT")
    private String progressText;

    private LocalDateTime timestamp;

    @OneToMany(mappedBy = "checkIn", cascade = CascadeType.ALL)
    private List<Comment> comments;

    // Getters and Setters
    public Integer getCheckInId() { return checkInId; }
    public void setCheckInId(Integer checkInId) { this.checkInId = checkInId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public String getProgressText() { return progressText; }
    public void setProgressText(String progressText) { this.progressText = progressText; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }
}

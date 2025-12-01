package com.syncup.repository;

import com.syncup.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // "Bulk" fetcher: SELECT * FROM projects WHERE team_id IN (1, 2, 5, ...)
    List<Project> findByTeamIdIn(List<Long> teamIds);

    List<Project> findByTeamId(Long teamId);
}
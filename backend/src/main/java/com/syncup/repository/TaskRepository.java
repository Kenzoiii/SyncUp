package com.syncup.repository;

import com.syncup.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // OPTIMIZED: Fetches Task + Assigned User in ONE query
    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.assignedUser WHERE t.projectId = :projectId")
    List<Task> findByProjectId(@Param("projectId") Long projectId);

    // Standard efficient lookups
    List<Task> findByAssignedUserId(Long assignedUserId);

    // DASHBOARD COUNTS (Very fast, returns a simple number)
    long countByStatus(Task.Status status);
    long countByAssignedUserIdAndStatus(Long userId, Task.Status status);
}
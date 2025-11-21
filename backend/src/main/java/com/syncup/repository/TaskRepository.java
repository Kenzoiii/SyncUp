package com.syncup.repository;

import com.syncup.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssignedUserId(Long assignedUserId);
    List<Task> findByStatus(Task.Status status);
    List<Task> findByProjectIdAndStatus(Long projectId, Task.Status status);
}

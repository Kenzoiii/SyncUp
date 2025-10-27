package com.example.syncup.repository;

import com.example.syncup.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, Integer> {
    // All necessary CRUD methods are inherited from JpaRepository
}
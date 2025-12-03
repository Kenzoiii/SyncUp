package com.syncup.repository;

import com.syncup.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    // OPTIMIZED: Fetch Member + User Details (Name, Email) together
    @Query("SELECT tm FROM TeamMember tm JOIN FETCH tm.user WHERE tm.teamId = :teamId")
    List<TeamMember> findByTeamId(@Param("teamId") Long teamId);

    List<TeamMember> findByUserId(Long userId);

    // Security Checks
    Optional<TeamMember> findByTeamIdAndUserId(Long teamId, Long userId);

    boolean existsByTeamIdAndUserId(Long teamId, Long userId);
}
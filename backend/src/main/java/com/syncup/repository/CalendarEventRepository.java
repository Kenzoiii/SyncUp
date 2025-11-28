package com.syncup.repository;

import com.syncup.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    // Fetch events within a date range (Essential for Calendar View)
    @Query("SELECT e FROM CalendarEvent e WHERE e.userId = :userId AND e.startTime BETWEEN :start AND :end")
    List<CalendarEvent> findEventsForMonth(@Param("userId") Long userId,
                                           @Param("start") LocalDateTime start,
                                           @Param("end") LocalDateTime end);
}
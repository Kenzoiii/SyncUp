package com.syncup.repository;

import com.syncup.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Fetch notifications for a specific user, ordered by newest first
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Count unread notifications (Good for badges in the Navbar)
    long countByUserIdAndIsReadFalse(Long userId);
}
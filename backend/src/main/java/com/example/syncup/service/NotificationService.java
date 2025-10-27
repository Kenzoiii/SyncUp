package com.example.syncup.service;

import com.example.syncup.entity.Notification;
import com.example.syncup.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Notification getNotificationById(Integer id) {
        return notificationRepository.findById(id).orElse(null);
    }

    public void deleteNotification(Integer id) {
        notificationRepository.deleteById(id);
    }
}

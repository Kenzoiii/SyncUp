package com.example.syncup.service;

import com.example.syncup.entity.CheckIn;
import com.example.syncup.repository.CheckInRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CheckInService {
    private final CheckInRepository checkInRepository;

    public CheckInService(CheckInRepository checkInRepository) {
        this.checkInRepository = checkInRepository;
    }

    public List<CheckIn> getAllCheckIns() {
        return checkInRepository.findAll();
    }

    public CheckIn saveCheckIn(CheckIn checkIn) {
        return checkInRepository.save(checkIn);
    }
}

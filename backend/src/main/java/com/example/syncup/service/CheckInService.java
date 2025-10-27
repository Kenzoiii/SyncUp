package com.example.syncup.service;

import com.example.syncup.entity.CheckIn;
import com.example.syncup.repository.CheckInRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public CheckIn getCheckInById(Integer id) {
        Optional<CheckIn> checkIn = checkInRepository.findById(id);
        return checkIn.orElse(null); // or throw exception if not found
    }

    public void deleteCheckIn(Integer id) {
        checkInRepository.deleteById(id);
    }
}

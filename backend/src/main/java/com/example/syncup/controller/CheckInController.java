package com.example.syncup.controller;

import com.example.syncup.entity.CheckIn;
import com.example.syncup.service.CheckInService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checkins")
public class CheckInController {

    private final CheckInService checkInService;

    public CheckInController(CheckInService checkInService) {
        this.checkInService = checkInService;
    }

    @GetMapping
    public List<CheckIn> getAllCheckIns() {
        return checkInService.getAllCheckIns();
    }

    @GetMapping("/{id}")
    public CheckIn getCheckInById(@PathVariable Integer id) {
        return checkInService.getCheckInById(id);
    }

    @PostMapping
    public CheckIn createCheckIn(@RequestBody CheckIn checkIn) {
        return checkInService.saveCheckIn(checkIn);
    }

    @PutMapping("/{id}")
    public CheckIn updateCheckIn(@PathVariable Integer id, @RequestBody CheckIn checkIn) {
        checkIn.setCheckInId(id);
        return checkInService.saveCheckIn(checkIn);
    }

    @DeleteMapping("/{id}")
    public void deleteCheckIn(@PathVariable Integer id) {
        checkInService.deleteCheckIn(id);
    }
}

package com.booking.demo.booking.controller;

import com.booking.demo.booking.model.SafariPoint;
import com.booking.demo.booking.service.SafariPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/safari")
@CrossOrigin(origins = "http://localhost:5173")
public class SafariPointController {

    @Autowired
    private SafariPointService service;

    @PostMapping("/point")
    public SafariPoint savePoint(@RequestBody SafariPoint point) {
        return service.save(point); // assumes frontend includes userId
    }

    @GetMapping("/points/{tourId}/{userId}")
    public List<SafariPoint> getPoints(@PathVariable Long tourId, @PathVariable Long userId) {
        return service.getPointsByTourAndUser(tourId, userId);
    }

    @DeleteMapping("/points/{tourId}/{userId}")
    public ResponseEntity<?> deletePoints(@PathVariable Long tourId, @PathVariable Long userId) {
        service.deletePointsByTourAndUser(tourId, userId);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/point/{id}")
    public ResponseEntity<?> deletePointById(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }

}

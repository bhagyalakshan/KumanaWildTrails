package com.booking.demo.booking.controller;

import com.booking.demo.booking.dto.SOSAlertDTO;
import com.booking.demo.booking.model.Driver;
import com.booking.demo.booking.repository.DriverRepository;
import com.booking.demo.booking.service.SOSAlertService;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sos")
@RequiredArgsConstructor
public class SOSAlertController {

    private final SOSAlertService sosAlertService;
    private final DriverRepository driverRepository;

    @PostMapping
    public ResponseEntity<?> sendSOS(@RequestBody SOSAlertDTO dto,
                                     Authentication authentication) {
        String email = authentication.getName();
        Driver driver = driverRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        sosAlertService.saveAlert(dto, driver);

        return ResponseEntity.ok("SOS alert saved");
    }

    @PatchMapping("/resolve/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> ResolveSosAlert(@PathVariable Long id) {
        sosAlertService.markAsSolved(id);
        return ResponseEntity.ok("Mark as solved");
    }

    @GetMapping("/unresolved")
    public List<SOSAlertDTO> getUnresolvedAlerts() {
        return sosAlertService.getUnresolvedAlertsForDrivers();
    }




}
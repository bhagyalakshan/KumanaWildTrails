package com.booking.demo.booking.controller;

import com.booking.demo.booking.dto.TodayStatResponse;
import com.booking.demo.booking.service.TodayStatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final TodayStatService todayStatService;

    @GetMapping("/todaystat")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TodayStatResponse> getTodayStat() {
        TodayStatResponse response = todayStatService.getTodayStats();
        return ResponseEntity.ok(response);
    }
}
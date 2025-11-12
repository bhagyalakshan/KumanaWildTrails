package com.booking.demo.booking.service;

import com.booking.demo.booking.dto.QuickStatsDTO;
import com.booking.demo.booking.dto.SafariDTO;
import com.booking.demo.booking.dto.TodayStatResponse;
import com.booking.demo.booking.model.Booking;
import com.booking.demo.booking.repository.BookingRepository;
import com.booking.demo.booking.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodayStatService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DriverRepository driverRepository;

    public TodayStatResponse getTodayStats() {
        // Get today's date (based on IST, +0530)
        LocalDate today = LocalDate.now();

        // Fetch bookings for today
        List<Booking> bookings = bookingRepository.findBySafariDate(today);

        // Map bookings to SafariDTO
        List<SafariDTO> safaris = bookings.stream().map(booking -> {
            // Format bookingDate to "HH:MM AM/PM"
            String time = booking.getBookingDate() != null
                    ? booking.getBookingDate().format(DateTimeFormatter.ofPattern("hh:mm a"))
                    : "N/A";
            // Calculate total guests (adults + kids)
            Integer guests = (booking.getNumAdults() != null ? booking.getNumAdults() : 0)
                    + (booking.getNumKids() != null ? booking.getNumKids() : 0);
            return new SafariDTO(
                    booking.getId(),
                    time,
                    booking.getAssignedDriver() != null ? booking.getAssignedDriver() : "Unassigned",
                    guests,
                    booking.getStatus() != null ? booking.getStatus() : "scheduled"
            );
        }).collect(Collectors.toList());

        // Fetch quick stats
        QuickStatsDTO quickStats = new QuickStatsDTO(
                (int) driverRepository.countByStatus("Available"),
                (int) driverRepository.countDistinctVehicles(),
                47 // Placeholder for sightings (no model provided)
        );

        return new TodayStatResponse(safaris, quickStats);
    }
}
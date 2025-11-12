package com.booking.demo.booking.controller;

import com.booking.demo.booking.model.ApiResponse;
import com.booking.demo.booking.model.Booking;
import com.booking.demo.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/api")
    public ApiResponse homeController() {
        ApiResponse res = new ApiResponse();
        res.setMessage("welcome to Booking Api");
        res.setStatus(true);
        return res;
    }

    @GetMapping("/api/bookings")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBooking();
    }

    @PostMapping("/api/bookings")
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @DeleteMapping("/api/bookings/{id}")
    public ApiResponse deleteBooking(@PathVariable("id") Long bookingId) throws Exception {
        bookingService.deleteBooking(bookingId);
        ApiResponse res = new ApiResponse();
        res.setStatus(true);
        res.setMessage("Booking deleted successfully.");
        return res;
    }

    @PostMapping("/api/bookings/{id}/reject")
    public ResponseEntity<String> rejectBooking(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String reason = request.get("reason");
            bookingService.rejectBooking(id, reason);
            return ResponseEntity.ok("Booking rejected");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/api/bookings/by-email")
    public List<Booking> getBookingsByEmail(@RequestParam(required = false) String email) {
        if (email != null && !email.isEmpty()) {
            return bookingService.getBookingsByEmail(email);
        }
        return bookingService.getAllBooking();
    }

    @PutMapping("/api/bookings/{id}/status")
    public ApiResponse updateBookingStatus(@PathVariable("id") Long bookingId, @RequestBody Map<String, String> body) throws Exception {
        String status = body.get("status");
        bookingService.updateBookingStatus(bookingId, status);
        ApiResponse res = new ApiResponse();
        res.setStatus(true);
        res.setMessage("Booking status updated to " + status);
        return res;
    }

    @PostMapping("/api/bookings/{id}/assign-driver")
    public ApiResponse assignDriverToBooking(@PathVariable("id") Long bookingId, @RequestBody Map<String, String> body) throws Exception {
        String driverName = body.get("driverName");
        String driverPhoneNumber = body.get("driverPhoneNumber");
        bookingService.assignDriver(bookingId, driverName, driverPhoneNumber);

        ApiResponse res = new ApiResponse();
        res.setStatus(true);
        res.setMessage("Driver assigned to booking successfully.");
        return res;
    }
}

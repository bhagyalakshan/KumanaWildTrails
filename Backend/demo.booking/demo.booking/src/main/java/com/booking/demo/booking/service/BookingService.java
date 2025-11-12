package com.booking.demo.booking.service;

import com.booking.demo.booking.model.Booking;

import java.util.List;

public interface BookingService {
    List<Booking> getAllBooking();
    Booking createBooking(Booking booking);
    void deleteBooking(Long id) throws Exception;
    void assignDriver(Long id, String driverName, String driverPhoneNumber) throws Exception;
    void rejectBooking(Long id, String reason) throws Exception;
    List<Booking> getBookingsByEmail(String email);
    void updateBookingStatus(Long id, String status) throws Exception;
}

package com.booking.demo.booking.repository;

import com.booking.demo.booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b FROM Booking b WHERE FUNCTION('DATE', b.safariDate) = :safariDate")
    List<Booking> findBySafariDate(@Param("safariDate") LocalDate safariDate);
    List<Booking> findByAssignedDriverContaining(String phoneNumber);
    List<Booking> findByAssignedDriverContainingAndBookingDateBetween(
            String phoneNumber, LocalDateTime startDateTime, LocalDateTime endDateTime);
    List<Booking> findByAssignedDriverContainingAndSafariDateBetween(
            String driverPhone, LocalDate startDate, LocalDate endDate
    );
    List<Booking> findByGuestEmail(String email);
}

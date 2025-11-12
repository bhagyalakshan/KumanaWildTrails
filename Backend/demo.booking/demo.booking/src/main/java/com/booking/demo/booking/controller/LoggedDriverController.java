package com.booking.demo.booking.controller;
import com.booking.demo.booking.dto.DriverBookingDTO;
import com.booking.demo.booking.dto.DriverBookingDetailsDTO;
import com.booking.demo.booking.model.Booking;
import com.booking.demo.booking.repository.BookingRepository;
import com.booking.demo.booking.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.booking.demo.booking.repository.LoggedDriverRepository;
import com.booking.demo.booking.service.LoggedDriverService;
import com.booking.demo.booking.dto.LoggedDriverDTO;
import com.booking.demo.booking.dto.DriverPasswordChangeDTO;
import com.booking.demo.booking.model.Driver;

@RestController
@RequestMapping("/api/driver")
public class LoggedDriverController  {

    @Autowired
    private LoggedDriverRepository driverRepository;
    @Autowired
    private DriverRepository driverRepository1;
    @Autowired
    private LoggedDriverService driverService;

    @PostMapping("/update/photo")
    public ResponseEntity<String> uploadPhoto(@RequestParam("file") MultipartFile file, Authentication auth) throws IOException {
        System.out.println("Received file: " + file.getOriginalFilename());
        String email = auth.getName();
        Driver driver = driverRepository.findByUser_Email(email)
                .orElseThrow(() -> new UsernameNotFoundException("Driver not found"));

        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path uploadPath = Paths.get("uploads/");
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String url = "/uploads/" + fileName;
//        driver.setPhoto_url(url);
        driverRepository.save(driver);

        return ResponseEntity.ok(url);
    }

    @GetMapping("/get_loggedin")
    public ResponseEntity<LoggedDriverDTO> getLoggedInDriver(Authentication auth) {
        String email = auth.getName();
        Driver driver = driverRepository.findByUser_Email(email)
                .orElseThrow(() -> new UsernameNotFoundException("Driver not found"));

        LoggedDriverDTO dto = new LoggedDriverDTO();
        dto.setIsAvailable(driver.getStatus());
        dto.setVehicle_type(driver.getVehicleType());
       // dto.setPhoto_url(driver.getPhoto_url());
        return ResponseEntity.ok(dto);
    }
    @PutMapping("/update/settings")
    public ResponseEntity<?> updateSettings(@RequestBody LoggedDriverDTO dto, Principal principal) {
        String email = principal.getName();
        driverService.updateDriverSettings(email, dto);
        return ResponseEntity.ok("Settings updated successfully");
    }
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody DriverPasswordChangeDTO dto, Principal principal) {
        String email = principal.getName();
        driverService.changePassword(email, dto);
        return ResponseEntity.ok("Password updated successfully");
    }

    @Autowired
    private BookingRepository bookingRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @GetMapping("booking/{driverId}")
    public List<DriverBookingDTO> getBookingsByDriver(@PathVariable Long driverId) {
        // Step 1: Find driver by ID
        Driver driver = driverRepository1.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        String driverPhone = driver.getPhoneNumber();

        // Step 2: Define range = today → end of month
        LocalDate today = LocalDate.now();
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        // Step 3: Fetch by safariDate, not bookingDate
        List<Booking> bookings = bookingRepository
                .findByAssignedDriverContainingAndSafariDateBetween(
                        driverPhone,
                        today,      // start from today’s safaris
                        endOfMonth  // until end of this month
                );

        // Step 4: Convert to DTO
        return bookings.stream()
                .map(b -> new DriverBookingDTO(
                        b.getId(),
                        b.getSafariDate().toString(), // show safari date instead of booking date
                        b.getNumAdults(),
                        b.getSafariPackageName()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("booking/all/{driverId}")
    public List<DriverBookingDetailsDTO> getAllBookingsByDriver(@PathVariable Long driverId) {
        // Step 1: Find driver by ID
        Driver driver = driverRepository1.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        String driverPhone = driver.getPhoneNumber();

        // Step 2: Get range (start of this month → end of next month)
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfNextMonth = today.plusMonths(1).withDayOfMonth(today.plusMonths(1).lengthOfMonth());

        // Step 3: Fetch bookings for this driver across both months
        List<Booking> bookings = bookingRepository
                .findByAssignedDriverContainingAndSafariDateBetween(
                        driverPhone,
                        startOfMonth,
                        endOfNextMonth
                );

        // Step 4: Convert to DTO
        return bookings.stream()
                .map(b -> new DriverBookingDetailsDTO(
                        b.getSafariDate(),
                        b.getPickupLocation(),
                        b.getNumAdults(),
                        b.getSafariPackageName(),
                        b.getGuestName(),
                        b.getGuestPhone()
                ))
                .collect(Collectors.toList());
    }


}



package com.booking.demo.booking.service;

import com.booking.demo.booking.dto.DriverPasswordChangeDTO;
import com.booking.demo.booking.dto.LoggedDriverDTO;
import com.booking.demo.booking.repository.LoggedDriverRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.booking.demo.booking.repository.UserRepository;
import com.booking.demo.booking.model.Driver;
import com.booking.demo.booking.model.User;

import java.util.Optional;

@Service
public class LoggedDriverService {

    private final LoggedDriverRepository driverRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoggedDriverService(LoggedDriverRepository driverRepository,
                               UserRepository userRepository,
                               PasswordEncoder passwordEncoder) {
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void updateDriverSettings(String email, LoggedDriverDTO dto) {
        Optional<Driver> optionalDriver = driverRepository.findByUser_Email(email);
        if (optionalDriver.isEmpty()) {
            throw new UsernameNotFoundException("Driver not found");
        }
        Driver driver = optionalDriver.get();

        if (dto.getIsAvailable() != null) {
            driver.setStatus(dto.getIsAvailable());
        }
        if (dto.getVehicle_type() != null) {
            driver.setVehicleType(dto.getVehicle_type());
        }
        driverRepository.save(driver);
    }

    public void changePassword(String email, DriverPasswordChangeDTO dto) {
        Optional<Driver> optionalDriver = driverRepository.findByUser_Email(email);
        if (optionalDriver.isEmpty()) {
            throw new UsernameNotFoundException("Driver not found");
        }

        Driver driver = optionalDriver.get();
        User user = driver.getUser();

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

}

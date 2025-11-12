package com.booking.demo.booking.service;

import com.booking.demo.booking.dto.DDto;
import com.booking.demo.booking.model.Driver;
import com.booking.demo.booking.model.Role;
import com.booking.demo.booking.model.User;
import com.booking.demo.booking.repository.DriverRepository;
import com.booking.demo.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class DriverServiceImpl implements DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Driver createDriver(Driver driver) {
        driver.setCreatedAt(LocalDateTime.now());
        driver.setUpdatedAt(LocalDateTime.now());
        return driverRepository.save(driver);
    }

    @Override
    public User createDriverAndUser(User user, Driver driver) {
        user.setRole(Role.DRIVER); // Ensure role is set to DRIVER
        User savedUser = userRepository.save(user);
        driver.setUser(savedUser);
        driver.setCreatedAt(LocalDateTime.now());
        driver.setUpdatedAt(LocalDateTime.now());
        driverRepository.save(driver);
        return savedUser;
    }

    @Override
    public List<DDto> getAllDrivers() {
        return driverRepository.findAll()
                .stream()
                .map(driver -> new DDto(
                        driver.getId(),
                        driver.getUser() != null ? driver.getUser().getName() : null,
                        driver.getUser() != null ? driver.getUser().getEmail() : null,
                        driver.getPhoneNumber(),
                        driver.getAddress(),
                        driver.getLicenseNumber(),
                        driver.getVehicleType(),
                        driver.getVehicleNumber(),
                        driver.getStatus()
                ))
                .toList();
    }

    @Override
    public Driver updateDriver(Long id, Driver updatedDriver) {
        Driver driver = driverRepository.findById(id).orElseThrow();

        driver.setLicenseNumber(updatedDriver.getLicenseNumber());
        driver.setPhoneNumber(updatedDriver.getPhoneNumber());
        driver.setEmail(updatedDriver.getEmail());
        driver.setAddress(updatedDriver.getAddress());
        driver.setVehicleType(updatedDriver.getVehicleType());
        driver.setVehicleNumber(updatedDriver.getVehicleNumber());
        driver.setStatus(updatedDriver.getStatus());
        driver.setUpdatedAt(LocalDateTime.now());

        if (updatedDriver.getUser() != null && updatedDriver.getUser().getName() != null) {
            driver.getUser().setName(updatedDriver.getUser().getName());
        }

        return driverRepository.save(driver);
    }


    @Override
    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }
}
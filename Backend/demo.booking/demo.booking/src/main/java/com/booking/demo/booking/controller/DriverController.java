package com.booking.demo.booking.controller;

import com.booking.demo.booking.dto.ActiveDriverDTO;
import com.booking.demo.booking.dto.DDto;
import com.booking.demo.booking.model.Driver;
import com.booking.demo.booking.model.User;
import com.booking.demo.booking.repository.DriverRepository;
import com.booking.demo.booking.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "http://localhost:5173")
public class DriverController {

    @Autowired
    private DriverService driverService;
    @Autowired
    private DriverRepository driverRepository;

    @GetMapping("/getActiveDrivers")
    public ResponseEntity<?> getActiveDrivers() {
        List<Driver> activeDrivers = driverRepository.findByStatus("Available");

        List<ActiveDriverDTO> driverDTOs = activeDrivers.stream().map(driver -> {
            ActiveDriverDTO dto = new ActiveDriverDTO();
            dto.setStatus(driver.getStatus());
            dto.setVehicle_type(driver.getVehicleType());
            dto.setAddress(driver.getAddress());
            dto.setPhoneNumber(driver.getPhoneNumber());
            dto.setName(driver.getUser().getName());
            return dto;
        }).toList();
        return ResponseEntity.ok(driverDTOs);
    }

    @PostMapping("/register")
    public User createDriverAndUser(@RequestBody DriverRegistrationRequest request) {
        return driverService.createDriverAndUser(request.getUser(), request.getDriver());
    }

    @PostMapping
    public Driver createDriver(@RequestBody Driver driver) {
        return driverService.createDriver(driver);
    }

    @GetMapping
    public List<DDto> getAllDrivers() {
        return driverService.getAllDrivers();
    }
    @DeleteMapping("/{id}")
    public void deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
    }

    @PutMapping("/{id}")
    public Driver updateDriver(@PathVariable Long id, @RequestBody Driver driver) {
        return driverService.updateDriver(id, driver);
    }
}

// DTO for handling the combined request
class DriverRegistrationRequest {
    private User user;
    private Driver driver;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }
}
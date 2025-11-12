package com.booking.demo.booking.service;

import com.booking.demo.booking.dto.DDto;
import com.booking.demo.booking.model.Driver;
import com.booking.demo.booking.model.User;
import java.util.List;

public interface DriverService {
    Driver createDriver(Driver driver);
    User createDriverAndUser(User user, Driver driver);
    List<DDto> getAllDrivers();
    Driver updateDriver(Long id, Driver driver);
    void deleteDriver(Long id);
}
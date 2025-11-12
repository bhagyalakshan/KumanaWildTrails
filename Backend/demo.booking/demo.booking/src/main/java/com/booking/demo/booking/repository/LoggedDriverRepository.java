package com.booking.demo.booking.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.booking.demo.booking.model.Driver;
import com.booking.demo.booking.model.User;

public interface LoggedDriverRepository extends JpaRepository<Driver, Integer > {
    Optional<Driver> findByUser(User user);

    Optional<Driver> findByUser_Email(String email);
}
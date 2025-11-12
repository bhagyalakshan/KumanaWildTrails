package com.booking.demo.booking.repository;

import com.booking.demo.booking.model.Driver;
import com.booking.demo.booking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

Optional<Driver> findByUser(User user);
Optional<Driver> findByUser_Email(String email);
    List<Driver> findByStatus(String status);
    long countByStatus(String status);
    Optional<Driver> findById(Integer id);
    @Query("SELECT COUNT(DISTINCT d.vehicleNumber) FROM Driver d")
    long countDistinctVehicles();

}
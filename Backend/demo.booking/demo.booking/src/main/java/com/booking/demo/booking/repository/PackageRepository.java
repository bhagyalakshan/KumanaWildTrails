package com.booking.demo.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.booking.demo.booking.model.Package;



public interface PackageRepository extends JpaRepository<Package, Long> {
}

package com.booking.demo.booking.repository;

import com.booking.demo.booking.model.SafariPoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SafariPointRepository extends JpaRepository<SafariPoint, Long> {
    List<SafariPoint> findByTourId(Long tourId);
    List<SafariPoint> findByTourIdAndUserId(Long tourId, Long userId);
    void deleteByTourIdAndUserId(Long tourId, Long userId);
}


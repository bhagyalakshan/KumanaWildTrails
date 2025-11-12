package com.booking.demo.booking.repository;

import com.booking.demo.booking.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
package com.booking.demo.booking.controller;

import com.booking.demo.booking.dto.CreateReviewDTO;
import com.booking.demo.booking.dto.ReviewDTO;
import com.booking.demo.booking.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/getAll")
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        try {
            List<ReviewDTO> reviews = reviewService.getAllReviews();
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok("Review deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting review");
        }
    }
    @PatchMapping("edit/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> editReview(@PathVariable Long id, @RequestBody ReviewDTO reviewDTO) {
        try {
            reviewService.editReview(id, reviewDTO);
            return ResponseEntity.ok("Review updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating review");
        }
    }

    @PostMapping("createReview")
    public ResponseEntity<String> createReview(@RequestBody CreateReviewDTO createReviewDTO) {
        try {
            reviewService.createReview(createReviewDTO);
            return ResponseEntity.ok("Review submitted successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error submitting review");
        }
    }

}

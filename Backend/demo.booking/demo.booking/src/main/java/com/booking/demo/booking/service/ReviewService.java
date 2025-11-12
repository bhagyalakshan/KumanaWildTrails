package com.booking.demo.booking.service;

import com.booking.demo.booking.dto.CreateReviewDTO;
import com.booking.demo.booking.dto.ReviewDTO;
import com.booking.demo.booking.model.Review;
import com.booking.demo.booking.model.Customer;
import com.booking.demo.booking.model.Driver;
import com.booking.demo.booking.model.Booking;
import com.booking.demo.booking.repository.BookingRepository;
import com.booking.demo.booking.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;

    public List<ReviewDTO> getAllReviews() {


        return reviewRepository.findAll().stream().map(review -> {
            Booking booking = review.getBooking();

            String formattedDate = "";
            String customerName = "";
            String driverName = "";

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            if (booking != null) {
                if (booking.getBookingDate() != null) {
                    formattedDate = formatter.format(booking.getBookingDate());
                }

//                Customer customer = booking.getCustomer();
//                if (customer != null && customer.getUser() != null) {
//                    customerName = customer.getUser().getName();
//                }

                customerName = booking.getGuestName();
                driverName = booking.getAssignedDriver();

//                Driver driver = booking.getDriver();
//                if (driver != null && driver.getUser() != null) {
//                    driverName = driver.getUser().getName();
//                }
            }

            return new ReviewDTO(
                    review.getId(),
                    customerName,
                    review.getRating(),
                    formattedDate,
                    review.getComment(),
                    driverName
            );
        }).collect(Collectors.toList());
    }

    public void deleteReview(Long id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Review with ID " + id + " does not exist.");
        }
    }

    public void editReview(Long id, ReviewDTO reviewDTO) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id " + id));
        if (reviewDTO.getComment() != null) {
            review.setComment(reviewDTO.getComment());
        }
        reviewRepository.save(review);
    }
    public void createReview(CreateReviewDTO createReviewDTO) {
        // Fetch the Booking entity
        Booking booking = bookingRepository.findById(createReviewDTO.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with id " + createReviewDTO.getBookingId()));

        // Create and save the Review
        Review review = Review.builder()
                .booking(booking)
                .rating(createReviewDTO.getRating())
                .comment(createReviewDTO.getComment())
                .build();

        reviewRepository.save(review);
    }

}

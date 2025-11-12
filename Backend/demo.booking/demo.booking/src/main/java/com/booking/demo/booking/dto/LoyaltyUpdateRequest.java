package com.booking.demo.booking.dto;

import lombok.Data;

@Data
public class LoyaltyUpdateRequest {
    private Double initialPoint;  // e.g., 100
    private Double dollarRate;    // e.g., 1000 points = $1
}
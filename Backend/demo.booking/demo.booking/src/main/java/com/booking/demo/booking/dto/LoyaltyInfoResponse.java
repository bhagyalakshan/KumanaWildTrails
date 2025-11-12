package com.booking.demo.booking.dto;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoyaltyInfoResponse {
    private int currentPoints;
    private Double dollarRate;
}

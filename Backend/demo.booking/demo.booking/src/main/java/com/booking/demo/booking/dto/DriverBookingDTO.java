package com.booking.demo.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverBookingDTO {
    private Long id;
    private String bookingDate;
    private int numAdults;
    private String bookingType;
}

package com.booking.demo.booking.dto;

import lombok.Data;

@Data
public class DriverDTO {
    private Boolean isAvailable;
    private String photo_url;
    private String vehicle_type;
    private int seating_capacity;
}

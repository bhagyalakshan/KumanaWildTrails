package com.booking.demo.booking.dto;
import lombok.Data;

@Data
public class SOSAlertDTO {
    private int alertId;
    private double latitude;
    private double longitude;
    private String details;
    private String driverName;
    private boolean isSolved;
}

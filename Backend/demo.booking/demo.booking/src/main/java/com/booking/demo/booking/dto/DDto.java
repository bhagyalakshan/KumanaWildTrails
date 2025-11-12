package com.booking.demo.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DDto {
    private Long id;
    private String name;      // from User entity
    private String email;
    private String phoneNumber;
    private String address;
    private String licenseNumber;
    private String vehicleType;
    private String vehicleNumber;
    private String status;
}

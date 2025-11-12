package com.booking.demo.booking.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverBookingDetailsDTO {

    private LocalDate safariDate;
    private String pickupLocation;
    private Integer numAdults;
    private String safariPackageName;
    private String guestName;
    private String guestPhone;

}

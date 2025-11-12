package com.booking.demo.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SafariDTO {
    private Long id;
    private String time;
    private String guide;
    private Integer guests;
    private String status;
}
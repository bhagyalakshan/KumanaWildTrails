package com.booking.demo.booking.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity
@Table(name = "driver")
@Data
public class Driver {

    @Id
    private Long id;  // same as User.id, no @GeneratedValue

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String licenseNumber;
    private String phoneNumber;
    private String email;
    private String address;
    private String vehicleType;
    private String vehicleNumber;
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}




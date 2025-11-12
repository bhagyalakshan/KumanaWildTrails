package com.booking.demo.booking.controller;

import com.booking.demo.booking.dto.LoyaltyInfoResponse;
import com.booking.demo.booking.dto.LoyaltyUpdateRequest;
import com.booking.demo.booking.model.LoyaltyPoint;
import com.booking.demo.booking.service.LoyaltyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/loyalty")
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    public LoyaltyController(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    @GetMapping("/{email}")
    public ResponseEntity<LoyaltyInfoResponse> getLoyaltyInfo(@PathVariable String email) {
        LoyaltyInfoResponse response = loyaltyService.getLoyaltyInfoByEmail(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/id/{customerId}")
    public LoyaltyInfoResponse getLoyaltyInfo(@PathVariable int customerId) {
        return loyaltyService.getLoyaltyInfo(customerId);
    }

    @PutMapping("/update")
    public ResponseEntity<LoyaltyPoint> updateLoyaltySettings(
            @RequestBody LoyaltyUpdateRequest request) {
        LoyaltyPoint updated = loyaltyService.updateLoyaltySettings(request);
        return ResponseEntity.ok(updated);
    }



}

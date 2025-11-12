package com.booking.demo.booking.service;

import com.booking.demo.booking.dto.LoyaltyInfoResponse;
import com.booking.demo.booking.dto.LoyaltyUpdateRequest;
import com.booking.demo.booking.model.LoyaltyPoint;
import com.booking.demo.booking.repository.CustomerRepository;
import com.booking.demo.booking.repository.LoyaltyPointRepository;
import org.springframework.stereotype.Service;
import com.booking.demo.booking.model.Customer;

@Service
public class LoyaltyService {
    private final CustomerRepository customerRepository;
    private final LoyaltyPointRepository loyaltyPointRepository;


    public LoyaltyService(CustomerRepository customerRepository, LoyaltyPointRepository loyaltyPointRepository) {
        this.customerRepository = customerRepository;
        this.loyaltyPointRepository = loyaltyPointRepository;
    }

    public LoyaltyInfoResponse getLoyaltyInfoByEmail(String email) {
        int points = customerRepository.findByEmail(email)
                .map(Customer::getLoyalty_points)
                .orElse(0);

        // Example: calculate dollarRate
        double dollarRate = points * 1.0; // replace with your actual logic

        return new LoyaltyInfoResponse(points, dollarRate);
    }

    public LoyaltyInfoResponse getLoyaltyInfo(int customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        LoyaltyPoint loyaltyConfig = loyaltyPointRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Loyalty config not found"));

        return new LoyaltyInfoResponse(
                customer.getLoyalty_points(),
                loyaltyConfig.getDollarRate()
        );
    }

    public LoyaltyPoint updateLoyaltySettings(LoyaltyUpdateRequest request) {
        LoyaltyPoint settings = loyaltyPointRepository.findFirstByOrderByIdAsc()
                .orElse(new LoyaltyPoint());

        settings.setInitial_point(request.getInitialPoint());
        settings.setDollarRate(request.getDollarRate());

        return loyaltyPointRepository.save(settings);
    }

}

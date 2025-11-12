package com.booking.demo.booking.controller;

import com.booking.demo.booking.dto.UserDTO;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.booking.demo.booking.model.Customer;
import com.booking.demo.booking.model.Role;
import com.booking.demo.booking.model.User;
import com.booking.demo.booking.repository.CustomerRepository;
import com.booking.demo.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth/firebase")
@RequiredArgsConstructor
public class FirebaseAuthController {

    private final FirebaseAuth firebaseAuth;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    @Transactional
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestHeader("Authorization") String authHeader) {
        try {
            String idToken = authHeader.replace("Bearer ", "");
            FirebaseToken token = firebaseAuth.verifyIdToken(idToken);
            String email = token.getEmail();
            String name = token.getName();
            if (name == null || name.isEmpty()) {
                int atIndex = email.indexOf('@');
                name = (atIndex != -1) ? email.substring(0, atIndex) : email;
            }

            Optional<User> existingUserOpt = userRepository.findByEmail(email);
            User user;
            System.out.println(existingUserOpt);
            if (existingUserOpt.isEmpty()) {
                user = User.builder()
                        .email(email)
                        .name(name)
                        .role(Role.CUSTOMER)
                        .password("firebase_user")
                        .build();

                Customer customer = new Customer();
                customer.setUser(user);
                customer.setLoyalty_points(0);
                customer.setPhone_number("");
                customer.setAddress("");
                customer.setPhoto_url("");
                user.setCustomer(customer);

                try {
                    user = userRepository.save(user);
                } catch (Exception e) {
                    e.printStackTrace();
                    throw new RuntimeException(e);
                }
                System.out.println("Saved User ID: " + user.getId());
            } else {
                user = existingUserOpt.get();
                if (!customerRepository.existsByUser(user)) {
                    Customer customer = new Customer();
                    customer.setUser(user);
                    customer.setLoyalty_points(0);
                    customer.setPhone_number("");
                    customer.setAddress("");
                    customer.setPhoto_url("");
                    user.setCustomer(customer);
                    userRepository.save(user);
                }
            }
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setName(user.getName());
            userDTO.setEmail(user.getEmail());
            userDTO.setRole(user.getRole());
            return ResponseEntity.ok(userDTO);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid Firebase token: " + e.getMessage());
        }
    }
}

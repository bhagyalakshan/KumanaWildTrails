package com.booking.demo.booking.service;



import com.booking.demo.booking.dto.AuthResponse;
import com.booking.demo.booking.dto.RegisterRequest;
import com.booking.demo.booking.model.Driver;
import com.booking.demo.booking.model.Role;
import com.booking.demo.booking.model.User;
import com.booking.demo.booking.repository.DriverRepository;
import com.booking.demo.booking.repository.UserRepository;
import com.booking.demo.booking.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final DriverRepository driverRepository;

    public String login(String email, String password) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        return jwtUtil.generateToken(auth);
    }

//    public AuthResponse registerDriver(RegisterRequest request) {
//        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
//            throw new RuntimeException("Email already registered");
//        }
//
//        // 1. Create and save User with DRIVER role
//        User user = User.builder()
//                .name(request.getName())
//                .email(request.getEmail())
//                .password(passwordEncoder.encode(request.getPassword()))
//                .role(Role.DRIVER)
//                .build();
//
//        user = userRepository.save(user);
//
//        // 2. Create and save Driver
//        Driver driver = new Driver();
//        driver.setUser(user);
//        driver.setVehicle_type(request.getVehicleType());
//        driver.setSeating_capacity(request.getSeatingCapacity());
//        driver.set_available(true);
//        driverRepository.save(driver);
//
//        // 3. Return a dummy AuthResponse (no token needed here)
//        return AuthResponse.builder()
//                .message("Driver registered successfully")
//                .build();
//    }



    public AuthResponse registerAdmin(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword()));

        return new AuthResponse(token);
    }
}

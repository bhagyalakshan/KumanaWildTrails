package com.booking.demo.booking.controller;

import com.booking.demo.booking.model.User;
import com.booking.demo.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/check-email")
    public Response checkEmail(@RequestParam String email) {
        boolean exists = userRepository.existsByEmail(email);
        return new Response(exists);
    }
}

class Response {
    private boolean exists;

    public Response(boolean exists) {
        this.exists = exists;
    }

    public boolean isExists() {
        return exists;
    }

    public void setExists(boolean exists) {
        this.exists = exists;
    }
}
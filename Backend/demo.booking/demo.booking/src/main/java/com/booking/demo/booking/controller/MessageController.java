package com.booking.demo.booking.controller;

import com.booking.demo.booking.model.Message;
import com.booking.demo.booking.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")  // allow your React frontend
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @PostMapping
    public Message saveMessage(@RequestBody Message message) {
        return messageRepository.save(message);
    }
    @GetMapping
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }
    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable Long id) {
        messageRepository.deleteById(id);
    }

}

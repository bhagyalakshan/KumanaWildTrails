package com.booking.demo.booking.service;

import com.booking.demo.booking.model.Message;

import java.util.List;

public interface MessageService {

    Message createMessage (Message message);
    List<Message> getAllMessages();

}

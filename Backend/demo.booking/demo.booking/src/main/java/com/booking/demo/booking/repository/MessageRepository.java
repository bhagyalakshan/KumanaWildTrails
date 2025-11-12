package com.booking.demo.booking.repository;

import com.booking.demo.booking.model.Driver;
import com.booking.demo.booking.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {


}
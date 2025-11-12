package com.booking.demo.booking.service;

import com.booking.demo.booking.model.SafariPoint;
import com.booking.demo.booking.repository.SafariPointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import jakarta.transaction.Transactional;

@Service
public class SafariPointService {

    @Autowired
    private SafariPointRepository repository;

    public SafariPoint save(SafariPoint point) {
        return repository.save(point);
    }

    public List<SafariPoint> getPointsByTourAndUser(Long tourId, Long userId) {
        return repository.findByTourIdAndUserId(tourId, userId);
    }

    @Transactional
    public void deletePointsByTourAndUser(Long tourId, Long userId) {
        repository.deleteByTourIdAndUserId(tourId, userId);
    }
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

}

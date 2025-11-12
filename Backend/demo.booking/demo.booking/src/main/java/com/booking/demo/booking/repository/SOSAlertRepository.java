package com.booking.demo.booking.repository;



import com.booking.demo.booking.model.SOSAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SOSAlertRepository extends JpaRepository<SOSAlert, Long> {
    List<SOSAlert> findByTimestampAfter(LocalDateTime time);
    List<SOSAlert> findByIsSolvedFalse();
    List<SOSAlert> findByIsSolved(boolean isSolved);
}

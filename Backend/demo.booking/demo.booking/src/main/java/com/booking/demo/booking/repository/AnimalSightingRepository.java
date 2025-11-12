package com.booking.demo.booking.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.booking.demo.booking.model.AnimalSighting;

@Repository
public interface AnimalSightingRepository extends JpaRepository<AnimalSighting, Long> {
    List<AnimalSighting> findByAnimalNameAndDateTimeAfter(String animalName, LocalDateTime dateTime);
    List<AnimalSighting> findByDateTimeAfter(LocalDateTime time);
    List<AnimalSighting> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);

    @Query(value = """
    SELECT sub.animal_name, sub.rounded_lat AS lat, sub.rounded_lng AS lng, sub.sightings_count
    FROM (
        SELECT
            animal_name,
            ROUND(CAST(lat AS numeric), 3) AS rounded_lat,
            ROUND(CAST(lng AS numeric), 3) AS rounded_lng,
            COUNT(*) AS sightings_count,
            RANK() OVER (PARTITION BY animal_name ORDER BY COUNT(*) DESC) as rnk
        FROM animal_sightings
        WHERE date_time >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY animal_name, ROUND(CAST(lat AS numeric), 3), ROUND(CAST(lng AS numeric), 3)
    ) sub
    WHERE sub.rnk = 1
    """, nativeQuery = true)
    List<Object[]> findCurrentHotspots();

    @Query(value = """
    SELECT * FROM animal_sightings s
    WHERE LOWER(s.animal_name) = LOWER(:animalName)
      AND s.date_time >= :startDate
      AND EXTRACT(HOUR FROM s.date_time) BETWEEN 8 AND 16
    ORDER BY s.date_time
""", nativeQuery = true)
    List<AnimalSighting> findSightingsByAnimalAndHourRange(
            @Param("animalName") String animalName,
            @Param("startDate") LocalDateTime startDate
    );



}

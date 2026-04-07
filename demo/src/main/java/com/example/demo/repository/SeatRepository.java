package com.example.demo.repository;

import com.example.demo.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByShowId(Long showId);
    List<Seat> findByShowIdAndIsBooked(Long showId, Boolean isBooked);
    boolean existsByShowIdAndSeatNumberAndIsBooked(Long showId, String seatNumber, Boolean isBooked);
}

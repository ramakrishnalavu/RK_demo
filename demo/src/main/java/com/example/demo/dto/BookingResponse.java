package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data @Builder
public class BookingResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long showId;
    private String movieTitle;
    private String moviePosterUrl;
    private String theaterName;
    private String theaterLocation;
    private LocalDate showDate;
    private LocalTime showTime;
    private List<String> seatNumbers;
    private Double totalAmount;
    private String paymentStatus;
    private LocalDateTime bookingDate;
}

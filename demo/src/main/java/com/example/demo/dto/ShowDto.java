package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ShowDto {
    private Long id;
    @NotNull private Long movieId;
    private String movieTitle;
    private String moviePosterUrl;
    @NotNull private Long theaterId;
    private String theaterName;
    private String theaterLocation;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @NotNull private LocalDate showDate;

    @JsonFormat(pattern = "HH:mm")
    @NotNull private LocalTime showTime;

    @NotNull private Double ticketPrice;
    private Integer availableSeats;
}

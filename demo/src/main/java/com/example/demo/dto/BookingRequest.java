package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {
    @NotNull private Long showId;
    @NotNull private List<String> seatNumbers;
}

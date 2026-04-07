package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seats")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Seat {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    @ToString.Exclude
    @JsonIgnore  // prevents circular: Seat → Show → List<Seat> → ...
    private Show show;

    @Column(nullable = false)
    private String seatNumber;

    @Column(nullable = false)
    private Boolean isBooked = false;

    private String seatType; // STANDARD, PREMIUM, VIP
}

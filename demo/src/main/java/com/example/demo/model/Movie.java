package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "movies")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Movie {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String genre;
    private String language;
    private Integer releaseYear;
    private String posterUrl;
    private String description;

    @Column(name = "movie_cast")
    private String cast;

    private Double rating;
    private Integer durationMinutes;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonIgnore  // prevents circular: Movie → List<Show> → Show → Movie → ...
    private List<Show> shows;
}

package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MovieDto {
    private Long id;
    @NotBlank
    private String title;
    private String genre;
    private String language;
    private Integer releaseYear;
    private String posterUrl;
    private String description;
    private String cast;
    private Double rating;
    private Integer durationMinutes;
}

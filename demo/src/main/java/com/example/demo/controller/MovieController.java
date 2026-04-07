package com.example.demo.controller;

import com.example.demo.dto.MovieDto;
import com.example.demo.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping("/movies")
    public ResponseEntity<List<MovieDto>> getMovies(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) Integer releaseYear,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(movieService.getAllMovies(genre, language, releaseYear, search));
    }

    @GetMapping("/movies/{id}")
    public ResponseEntity<MovieDto> getMovie(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    @PostMapping("/admin/movies")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MovieDto> createMovie(@Valid @RequestBody MovieDto dto) {
        return ResponseEntity.ok(movieService.createMovie(dto));
    }

    @PutMapping("/admin/movies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MovieDto> updateMovie(@PathVariable Long id, @Valid @RequestBody MovieDto dto) {
        return ResponseEntity.ok(movieService.updateMovie(id, dto));
    }

    @DeleteMapping("/admin/movies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}

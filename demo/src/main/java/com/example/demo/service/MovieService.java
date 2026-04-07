package com.example.demo.service;

import com.example.demo.dto.MovieDto;
import com.example.demo.model.Movie;
import com.example.demo.repository.MovieRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;

    public List<MovieDto> getAllMovies(String genre, String language, Integer releaseYear, String search) {
        Specification<Movie> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (genre != null && !genre.isBlank())
                predicates.add(cb.equal(cb.lower(root.get("genre")), genre.toLowerCase()));
            if (language != null && !language.isBlank())
                predicates.add(cb.equal(cb.lower(root.get("language")), language.toLowerCase()));
            if (releaseYear != null)
                predicates.add(cb.equal(root.get("releaseYear"), releaseYear));
            if (search != null && !search.isBlank())
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + search.toLowerCase() + "%"));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return movieRepository.findAll(spec).stream().map(this::toDto).collect(Collectors.toList());
    }

    public MovieDto getMovieById(Long id) {
        return movieRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public MovieDto createMovie(MovieDto dto) {
        Movie movie = toEntity(dto);
        return toDto(movieRepository.save(movie));
    }

    public MovieDto updateMovie(Long id, MovieDto dto) {
        Movie existing = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        existing.setTitle(dto.getTitle());
        existing.setGenre(dto.getGenre());
        existing.setLanguage(dto.getLanguage());
        existing.setReleaseYear(dto.getReleaseYear());
        existing.setPosterUrl(dto.getPosterUrl());
        existing.setDescription(dto.getDescription());
        existing.setCast(dto.getCast());
        existing.setRating(dto.getRating());
        existing.setDurationMinutes(dto.getDurationMinutes());
        return toDto(movieRepository.save(existing));
    }

    public void deleteMovie(Long id) {
        movieRepository.findById(id).orElseThrow(() -> new RuntimeException("Movie not found"));
        movieRepository.deleteById(id);
    }

    private MovieDto toDto(Movie m) {
        MovieDto dto = new MovieDto();
        dto.setId(m.getId()); dto.setTitle(m.getTitle());
        dto.setGenre(m.getGenre()); dto.setLanguage(m.getLanguage());
        dto.setReleaseYear(m.getReleaseYear()); dto.setPosterUrl(m.getPosterUrl());
        dto.setDescription(m.getDescription()); dto.setCast(m.getCast());
        dto.setRating(m.getRating()); dto.setDurationMinutes(m.getDurationMinutes());
        return dto;
    }

    private Movie toEntity(MovieDto dto) {
        return Movie.builder()
                .title(dto.getTitle()).genre(dto.getGenre()).language(dto.getLanguage())
                .releaseYear(dto.getReleaseYear()).posterUrl(dto.getPosterUrl())
                .description(dto.getDescription()).cast(dto.getCast())
                .rating(dto.getRating()).durationMinutes(dto.getDurationMinutes())
                .build();
    }
}

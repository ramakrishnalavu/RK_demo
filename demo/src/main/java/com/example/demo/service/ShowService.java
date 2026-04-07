package com.example.demo.service;

import com.example.demo.dto.ShowDto;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowService {

    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final SeatRepository seatRepository;

    public List<ShowDto> getShowsByMovie(Long movieId, String date) {
        List<Show> shows;
        if (date != null && !date.isBlank()) {
            shows = showRepository.findByMovieIdAndShowDate(movieId, LocalDate.parse(date));
        } else {
            shows = showRepository.findByMovieId(movieId);
        }
        return shows.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ShowDto> getAllShows() {
        return showRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public ShowDto getById(Long id) {
        return toDto(showRepository.findById(id).orElseThrow(() -> new RuntimeException("Show not found")));
    }

    public List<Seat> getSeatsByShow(Long showId) {
        showRepository.findById(showId).orElseThrow(() -> new RuntimeException("Show not found"));
        return seatRepository.findByShowId(showId);
    }

    public ShowDto createShow(ShowDto dto) {
        Movie movie = movieRepository.findById(dto.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        Theater theater = theaterRepository.findById(dto.getTheaterId())
                .orElseThrow(() -> new RuntimeException("Theater not found"));

        Show show = Show.builder()
                .movie(movie).theater(theater)
                .showDate(dto.getShowDate()).showTime(dto.getShowTime())
                .ticketPrice(dto.getTicketPrice())
                .availableSeats(theater.getTotalSeats())
                .build();

        Show saved = showRepository.save(show);

        // Auto-generate seats
        List<Seat> seats = new ArrayList<>();
        String[] rows = {"A","B","C","D","E","F","G","H"};
        int seatsPerRow = theater.getTotalSeats() / rows.length;
        for (String row : rows) {
            for (int i = 1; i <= seatsPerRow; i++) {
                seats.add(Seat.builder()
                        .show(saved)
                        .seatNumber(row + i)
                        .isBooked(false)
                        .seatType(row.charAt(0) <= 'B' ? "VIP" : row.charAt(0) <= 'D' ? "PREMIUM" : "STANDARD")
                        .build());
            }
        }
        seatRepository.saveAll(seats);

        return toDto(saved);
    }

    public ShowDto updateShow(Long id, ShowDto dto) {
        Show existing = showRepository.findById(id).orElseThrow(() -> new RuntimeException("Show not found"));
        Movie movie = movieRepository.findById(dto.getMovieId()).orElseThrow(() -> new RuntimeException("Movie not found"));
        Theater theater = theaterRepository.findById(dto.getTheaterId()).orElseThrow(() -> new RuntimeException("Theater not found"));

        existing.setMovie(movie); existing.setTheater(theater);
        existing.setShowDate(dto.getShowDate()); existing.setShowTime(dto.getShowTime());
        existing.setTicketPrice(dto.getTicketPrice());
        return toDto(showRepository.save(existing));
    }

    public void deleteShow(Long id) {
        showRepository.deleteById(id);
    }

    private ShowDto toDto(Show s) {
        ShowDto dto = new ShowDto();
        dto.setId(s.getId());
        dto.setMovieId(s.getMovie().getId());
        dto.setMovieTitle(s.getMovie().getTitle());
        dto.setMoviePosterUrl(s.getMovie().getPosterUrl());
        dto.setTheaterId(s.getTheater().getId());
        dto.setTheaterName(s.getTheater().getName());
        dto.setTheaterLocation(s.getTheater().getLocation());
        dto.setShowDate(s.getShowDate()); dto.setShowTime(s.getShowTime());
        dto.setTicketPrice(s.getTicketPrice()); dto.setAvailableSeats(s.getAvailableSeats());
        return dto;
    }
}

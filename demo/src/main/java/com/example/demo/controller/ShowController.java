package com.example.demo.controller;

import com.example.demo.dto.ShowDto;
import com.example.demo.model.Seat;
import com.example.demo.service.ShowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ShowController {

    private final ShowService showService;

    @GetMapping("/shows")
    public ResponseEntity<List<ShowDto>> getShows(
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) String date) {
        if (movieId != null) {
            return ResponseEntity.ok(showService.getShowsByMovie(movieId, date));
        }
        return ResponseEntity.ok(showService.getAllShows());
    }

    @GetMapping("/shows/{id}")
    public ResponseEntity<ShowDto> getShow(@PathVariable Long id) {
        return ResponseEntity.ok(showService.getById(id));
    }

    @GetMapping("/shows/{id}/seats")
    public ResponseEntity<List<Seat>> getSeats(@PathVariable Long id) {
        return ResponseEntity.ok(showService.getSeatsByShow(id));
    }

    @PostMapping("/admin/shows")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ShowDto> createShow(@Valid @RequestBody ShowDto dto) {
        return ResponseEntity.ok(showService.createShow(dto));
    }

    @PutMapping("/admin/shows/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ShowDto> updateShow(@PathVariable Long id, @Valid @RequestBody ShowDto dto) {
        return ResponseEntity.ok(showService.updateShow(id, dto));
    }

    @DeleteMapping("/admin/shows/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteShow(@PathVariable Long id) {
        showService.deleteShow(id);
        return ResponseEntity.noContent().build();
    }
}

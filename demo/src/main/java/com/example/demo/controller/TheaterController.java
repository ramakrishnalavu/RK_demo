package com.example.demo.controller;

import com.example.demo.dto.TheaterDto;
import com.example.demo.service.TheaterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TheaterController {

    private final TheaterService theaterService;

    @GetMapping("/theaters")
    public ResponseEntity<List<TheaterDto>> getAll() {
        return ResponseEntity.ok(theaterService.getAllTheaters());
    }

    @GetMapping("/theaters/{id}")
    public ResponseEntity<TheaterDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(theaterService.getById(id));
    }

    @PostMapping("/admin/theaters")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TheaterDto> create(@RequestBody TheaterDto dto) {
        return ResponseEntity.ok(theaterService.create(dto));
    }

    @PutMapping("/admin/theaters/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TheaterDto> update(@PathVariable Long id, @RequestBody TheaterDto dto) {
        return ResponseEntity.ok(theaterService.update(id, dto));
    }

    @DeleteMapping("/admin/theaters/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        theaterService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

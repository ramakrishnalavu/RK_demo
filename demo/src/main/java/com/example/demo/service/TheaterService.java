package com.example.demo.service;

import com.example.demo.dto.TheaterDto;
import com.example.demo.model.Theater;
import com.example.demo.repository.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TheaterService {

    private final TheaterRepository theaterRepository;

    public List<TheaterDto> getAllTheaters() {
        return theaterRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public TheaterDto getById(Long id) {
        return toDto(theaterRepository.findById(id).orElseThrow(() -> new RuntimeException("Theater not found")));
    }

    public TheaterDto create(TheaterDto dto) {
        Theater theater = Theater.builder()
                .name(dto.getName()).location(dto.getLocation()).totalSeats(dto.getTotalSeats()).build();
        return toDto(theaterRepository.save(theater));
    }

    public TheaterDto update(Long id, TheaterDto dto) {
        Theater existing = theaterRepository.findById(id).orElseThrow(() -> new RuntimeException("Theater not found"));
        existing.setName(dto.getName());
        existing.setLocation(dto.getLocation());
        existing.setTotalSeats(dto.getTotalSeats());
        return toDto(theaterRepository.save(existing));
    }

    public void delete(Long id) {
        theaterRepository.deleteById(id);
    }

    private TheaterDto toDto(Theater t) {
        TheaterDto dto = new TheaterDto();
        dto.setId(t.getId()); dto.setName(t.getName());
        dto.setLocation(t.getLocation()); dto.setTotalSeats(t.getTotalSeats());
        return dto;
    }
}

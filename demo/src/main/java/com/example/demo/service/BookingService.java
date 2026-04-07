package com.example.demo.service;

import com.example.demo.dto.BookingRequest;
import com.example.demo.dto.BookingResponse;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final UserRepository userRepository;
    private final SeatRepository seatRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found"));

        // Validate seats are available
        for (String seatNum : request.getSeatNumbers()) {
            boolean alreadyBooked = seatRepository
                    .existsByShowIdAndSeatNumberAndIsBooked(show.getId(), seatNum, true);
            if (alreadyBooked) {
                throw new RuntimeException("Seat " + seatNum + " is already booked");
            }
        }

        // Mark seats as booked
        List<Seat> seats = seatRepository.findByShowId(show.getId());
        for (Seat seat : seats) {
            if (request.getSeatNumbers().contains(seat.getSeatNumber())) {
                seat.setIsBooked(true);
            }
        }
        seatRepository.saveAll(seats);

        // Update available seats
        show.setAvailableSeats(show.getAvailableSeats() - request.getSeatNumbers().size());
        showRepository.save(show);

        // Create booking
        double totalAmount = show.getTicketPrice() * request.getSeatNumbers().size();
        Booking booking = Booking.builder()
                .user(user).show(show)
                .seatNumbers(request.getSeatNumbers())
                .totalAmount(totalAmount)
                .paymentStatus(Booking.PaymentStatus.COMPLETED) // Stub: auto-complete
                .bookingDate(LocalDateTime.now())
                .build();

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        // Check: can cancel only if show is > 1 hour away
        LocalDateTime showDateTime = booking.getShow().getShowDate()
                .atTime(booking.getShow().getShowTime());
        if (LocalDateTime.now().plusHours(1).isAfter(showDateTime)) {
            throw new RuntimeException("Cannot cancel booking less than 1 hour before show");
        }

        booking.setPaymentStatus(Booking.PaymentStatus.CANCELLED);

        // Free the seats
        List<Seat> seats = seatRepository.findByShowId(booking.getShow().getId());
        for (Seat seat : seats) {
            if (booking.getSeatNumbers().contains(seat.getSeatNumber())) {
                seat.setIsBooked(false);
            }
        }
        seatRepository.saveAll(seats);

        Show show = booking.getShow();
        show.setAvailableSeats(show.getAvailableSeats() + booking.getSeatNumbers().size());
        showRepository.save(show);

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    private BookingResponse toResponse(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .userId(b.getUser().getId())
                .userName(b.getUser().getName())
                .showId(b.getShow().getId())
                .movieTitle(b.getShow().getMovie().getTitle())
                .moviePosterUrl(b.getShow().getMovie().getPosterUrl())
                .theaterName(b.getShow().getTheater().getName())
                .theaterLocation(b.getShow().getTheater().getLocation())
                .showDate(b.getShow().getShowDate())
                .showTime(b.getShow().getShowTime())
                .seatNumbers(b.getSeatNumbers())
                .totalAmount(b.getTotalAmount())
                .paymentStatus(b.getPaymentStatus().name())
                .bookingDate(b.getBookingDate())
                .build();
    }
}

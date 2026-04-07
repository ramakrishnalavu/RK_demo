package com.example.demo.service;

import com.example.demo.dto.DashboardStats;
import com.example.demo.model.Booking;
import com.example.demo.model.User;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final BookingRepository bookingRepository;
    private final TheaterRepository theaterRepository;

    public DashboardStats getDashboardStats() {
        return DashboardStats.builder()
                .totalUsers(userRepository.countByRole(User.Role.USER))
                .totalMovies(movieRepository.count())
                .totalBookings(bookingRepository.count())
                .confirmedBookings(bookingRepository.countByPaymentStatus(Booking.PaymentStatus.COMPLETED))
                .totalRevenue(bookingRepository.getTotalRevenue())
                .totalTheaters(theaterRepository.count())
                .build();
    }
}

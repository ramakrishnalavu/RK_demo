package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class DashboardStats {
    private long totalUsers;
    private long totalMovies;
    private long totalBookings;
    private long confirmedBookings;
    private Double totalRevenue;
    private long totalTheaters;
}

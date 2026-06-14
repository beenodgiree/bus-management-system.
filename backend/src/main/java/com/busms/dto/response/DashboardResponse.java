package com.busms.dto.response;

import java.math.BigDecimal;

/** Aggregated statistics shown on the dashboard home page. */
public record DashboardResponse(
        long totalBuses,
        long activeBuses,
        long totalDrivers,
        long availableDrivers,
        long totalSchedules,
        long totalBookings,
        long confirmedBookings,
        long pendingBookings,
        long paidBookings,
        long unpaidBookings,
        BigDecimal totalRevenue
) {}

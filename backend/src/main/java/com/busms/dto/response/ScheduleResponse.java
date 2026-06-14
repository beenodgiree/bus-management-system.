package com.busms.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ScheduleResponse(
        Long id,
        String origin,
        String destination,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        BigDecimal fare,
        Integer availableSeats,
        Long busId,
        String busNumber,
        Long driverId,
        String driverName
) {}

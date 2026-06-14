package com.busms.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ScheduleRequest(
        @NotBlank String origin,
        @NotBlank String destination,
        @NotNull LocalDateTime departureTime,
        @NotNull LocalDateTime arrivalTime,
        @NotNull @DecimalMin(value = "0.0", inclusive = false, message = "Fare must be positive") BigDecimal fare,
        @NotNull @Min(value = 0, message = "Seats cannot be negative") Integer availableSeats,
        @NotNull Long busId,
        @NotNull Long driverId
) {}

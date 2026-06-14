package com.busms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BookingRequest(
        @NotBlank String customerName,
        @NotBlank @Email(message = "A valid email is required") String customerEmail,
        @NotBlank String customerPhone,
        @NotNull @Min(value = 1, message = "At least one seat must be booked") Integer seatsBooked,
        @NotNull Long scheduleId
) {}

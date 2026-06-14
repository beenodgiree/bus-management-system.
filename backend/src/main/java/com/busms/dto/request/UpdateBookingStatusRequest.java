package com.busms.dto.request;

import com.busms.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateBookingStatusRequest(
        @NotNull BookingStatus bookingStatus
) {}

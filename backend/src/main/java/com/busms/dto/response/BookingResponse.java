package com.busms.dto.response;

import com.busms.entity.BookingStatus;
import com.busms.entity.PaymentStatus;

import java.math.BigDecimal;

public record BookingResponse(
        Long id,
        String bookingReference,
        String customerName,
        String customerEmail,
        String customerPhone,
        Integer seatsBooked,
        BigDecimal totalAmount,
        BookingStatus bookingStatus,
        PaymentStatus paymentStatus,
        Long scheduleId,
        String origin,
        String destination
) {}

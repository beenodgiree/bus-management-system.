package com.busms.mapper;

import com.busms.dto.response.BookingResponse;
import com.busms.entity.Booking;

public final class BookingMapper {
    private BookingMapper() {}

    public static BookingResponse toResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getBookingReference(),
                b.getCustomerName(),
                b.getCustomerEmail(),
                b.getCustomerPhone(),
                b.getSeatsBooked(),
                b.getTotalAmount(),
                b.getBookingStatus(),
                b.getPaymentStatus(),
                b.getSchedule().getId(),
                b.getSchedule().getOrigin(),
                b.getSchedule().getDestination()
        );
    }
}

package com.busms.service;

import com.busms.dto.request.BookingRequest;
import com.busms.dto.response.BookingResponse;
import com.busms.dto.response.PageResponse;
import com.busms.entity.BookingStatus;
import com.busms.entity.PaymentStatus;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    BookingResponse create(BookingRequest request);
    BookingResponse getById(Long id);
    PageResponse<BookingResponse> search(String customerName, BookingStatus bookingStatus,
                                         PaymentStatus paymentStatus, Pageable pageable);
    BookingResponse updatePaymentStatus(Long id, PaymentStatus status);
    BookingResponse updateBookingStatus(Long id, BookingStatus status);
    void delete(Long id);
}

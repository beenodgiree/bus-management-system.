package com.busms.service.impl;

import com.busms.dto.request.BookingRequest;
import com.busms.dto.response.BookingResponse;
import com.busms.dto.response.PageResponse;
import com.busms.entity.Booking;
import com.busms.entity.BookingStatus;
import com.busms.entity.BusSchedule;
import com.busms.entity.PaymentStatus;
import com.busms.exception.BusinessException;
import com.busms.exception.ResourceNotFoundException;
import com.busms.mapper.BookingMapper;
import com.busms.repository.BookingRepository;
import com.busms.repository.BusScheduleRepository;
import com.busms.service.BookingService;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BusScheduleRepository scheduleRepository;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              BusScheduleRepository scheduleRepository) {
        this.bookingRepository = bookingRepository;
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    @Transactional
    public BookingResponse create(BookingRequest request) {
        BusSchedule schedule = scheduleRepository.findById(request.scheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", request.scheduleId()));

        if (request.seatsBooked() > schedule.getAvailableSeats()) {
            throw new BusinessException("Not enough seats available. Remaining: " + schedule.getAvailableSeats());
        }

        // Reserve seats on the schedule.
        schedule.setAvailableSeats(schedule.getAvailableSeats() - request.seatsBooked());

        BigDecimal total = schedule.getFare().multiply(BigDecimal.valueOf(request.seatsBooked()));

        Booking booking = Booking.builder()
                .bookingReference(generateReference())
                .customerName(request.customerName())
                .customerEmail(request.customerEmail())
                .customerPhone(request.customerPhone())
                .seatsBooked(request.seatsBooked())
                .totalAmount(total)
                .bookingStatus(BookingStatus.PENDING)
                .paymentStatus(PaymentStatus.UNPAID)
                .schedule(schedule)
                .build();

        return BookingMapper.toResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponse getById(Long id) {
        return BookingMapper.toResponse(findOrThrow(id));
    }

    @Override
    public PageResponse<BookingResponse> search(String customerName, BookingStatus bookingStatus,
                                                PaymentStatus paymentStatus, Pageable pageable) {
        String name = (customerName == null || customerName.isBlank()) ? null : customerName;
        return PageResponse.from(
                bookingRepository.search(name, bookingStatus, paymentStatus, pageable)
                        .map(BookingMapper::toResponse));
    }

    @Override
    @Transactional
    public BookingResponse updatePaymentStatus(Long id, PaymentStatus status) {
        Booking booking = findOrThrow(id);
        booking.setPaymentStatus(status);
        // Paying confirms the booking automatically.
        if (status == PaymentStatus.PAID && booking.getBookingStatus() == BookingStatus.PENDING) {
            booking.setBookingStatus(BookingStatus.CONFIRMED);
        }
        return BookingMapper.toResponse(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Long id, BookingStatus status) {
        Booking booking = findOrThrow(id);
        // Cancelling a booking returns its seats to the schedule.
        if (status == BookingStatus.CANCELLED && booking.getBookingStatus() != BookingStatus.CANCELLED) {
            BusSchedule schedule = booking.getSchedule();
            schedule.setAvailableSeats(schedule.getAvailableSeats() + booking.getSeatsBooked());
        }
        booking.setBookingStatus(status);
        return BookingMapper.toResponse(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        bookingRepository.delete(findOrThrow(id));
    }

    private Booking findOrThrow(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
    }

    private String generateReference() {
        String ref;
        do {
            ref = "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (bookingRepository.existsByBookingReference(ref));
        return ref;
    }
}

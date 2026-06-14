package com.busms.service;

import com.busms.dto.request.BookingRequest;
import com.busms.dto.response.BookingResponse;
import com.busms.entity.Booking;
import com.busms.entity.BookingStatus;
import com.busms.entity.BusSchedule;
import com.busms.entity.PaymentStatus;
import com.busms.exception.BusinessException;
import com.busms.repository.BookingRepository;
import com.busms.repository.BusScheduleRepository;
import com.busms.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BusScheduleRepository scheduleRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private BusSchedule schedule(int seats, String fare) {
        BusSchedule s = new BusSchedule();
        s.setId(1L);
        s.setOrigin("Tokyo");
        s.setDestination("Osaka");
        s.setFare(new BigDecimal(fare));
        s.setAvailableSeats(seats);
        return s;
    }

    @Test
    void create_decrementsSeats_andCalculatesTotal() {
        BusSchedule s = schedule(45, "6500.00");
        BookingRequest request = new BookingRequest(
                "Yamada Taro", "taro@example.com", "080-0000-0000", 2, 1L);

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(s));
        when(bookingRepository.existsByBookingReference(anyString())).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> {
            Booking b = inv.getArgument(0);
            b.setId(10L);
            return b;
        });

        BookingResponse response = bookingService.create(request);

        assertThat(response.seatsBooked()).isEqualTo(2);
        assertThat(response.totalAmount()).isEqualByComparingTo("13000.00");
        assertThat(response.bookingStatus()).isEqualTo(BookingStatus.PENDING);
        assertThat(response.paymentStatus()).isEqualTo(PaymentStatus.UNPAID);
        assertThat(s.getAvailableSeats()).isEqualTo(43); // 45 - 2
    }

    @Test
    void create_throws_whenNotEnoughSeats() {
        BusSchedule s = schedule(1, "6500.00");
        BookingRequest request = new BookingRequest(
                "Yamada Taro", "taro@example.com", "080-0000-0000", 5, 1L);

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(s));

        assertThatThrownBy(() -> bookingService.create(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Not enough seats");
    }

    @Test
    void updatePaymentStatus_paid_confirmsBooking() {
        Booking booking = new Booking();
        booking.setId(10L);
        booking.setBookingStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.UNPAID);
        booking.setSchedule(schedule(40, "6500.00"));

        when(bookingRepository.findById(10L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingResponse response = bookingService.updatePaymentStatus(10L, PaymentStatus.PAID);

        assertThat(response.paymentStatus()).isEqualTo(PaymentStatus.PAID);
        assertThat(response.bookingStatus()).isEqualTo(BookingStatus.CONFIRMED);
    }
}

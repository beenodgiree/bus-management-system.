package com.busms.service.impl;

import com.busms.dto.response.DashboardResponse;
import com.busms.entity.BookingStatus;
import com.busms.entity.BusStatus;
import com.busms.entity.PaymentStatus;
import com.busms.repository.BookingRepository;
import com.busms.repository.BusRepository;
import com.busms.repository.BusScheduleRepository;
import com.busms.repository.DriverRepository;
import com.busms.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final BusRepository busRepository;
    private final DriverRepository driverRepository;
    private final BusScheduleRepository scheduleRepository;
    private final BookingRepository bookingRepository;

    public DashboardServiceImpl(BusRepository busRepository,
                                DriverRepository driverRepository,
                                BusScheduleRepository scheduleRepository,
                                BookingRepository bookingRepository) {
        this.busRepository = busRepository;
        this.driverRepository = driverRepository;
        this.scheduleRepository = scheduleRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public DashboardResponse getStatistics() {
        return new DashboardResponse(
                busRepository.count(),
                busRepository.countByStatus(BusStatus.ACTIVE),
                driverRepository.count(),
                driverRepository.countByAvailableTrue(),
                scheduleRepository.count(),
                bookingRepository.count(),
                bookingRepository.countByBookingStatus(BookingStatus.CONFIRMED),
                bookingRepository.countByBookingStatus(BookingStatus.PENDING),
                bookingRepository.countByPaymentStatus(PaymentStatus.PAID),
                bookingRepository.countByPaymentStatus(PaymentStatus.UNPAID),
                bookingRepository.totalPaidRevenue()
        );
    }
}

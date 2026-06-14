package com.busms.repository;

import com.busms.entity.Booking;
import com.busms.entity.BookingStatus;
import com.busms.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByBookingReference(String bookingReference);

    long countByBookingStatus(BookingStatus status);

    long countByPaymentStatus(PaymentStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.paymentStatus = com.busms.entity.PaymentStatus.PAID")
    BigDecimal totalPaidRevenue();

    /**
     * Search by customer name and optional status filters.
     * Null filters are ignored so one query serves the full search & filter UI.
     */
    @Query("""
            SELECT b FROM Booking b
            WHERE (:customerName IS NULL OR LOWER(b.customerName) LIKE LOWER(CONCAT('%', :customerName, '%')))
              AND (:bookingStatus IS NULL OR b.bookingStatus = :bookingStatus)
              AND (:paymentStatus IS NULL OR b.paymentStatus = :paymentStatus)
            """)
    Page<Booking> search(@Param("customerName") String customerName,
                         @Param("bookingStatus") BookingStatus bookingStatus,
                         @Param("paymentStatus") PaymentStatus paymentStatus,
                         Pageable pageable);
}

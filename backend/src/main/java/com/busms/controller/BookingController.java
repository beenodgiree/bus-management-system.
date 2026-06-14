package com.busms.controller;

import com.busms.dto.request.BookingRequest;
import com.busms.dto.request.UpdateBookingStatusRequest;
import com.busms.dto.request.UpdatePaymentStatusRequest;
import com.busms.dto.response.BookingResponse;
import com.busms.dto.response.PageResponse;
import com.busms.entity.BookingStatus;
import com.busms.entity.PaymentStatus;
import com.busms.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Bookings", description = "Customer booking and payment management")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    @Operation(summary = "Search bookings by customer name, booking status and payment status (paged)")
    public ResponseEntity<PageResponse<BookingResponse>> search(
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) BookingStatus bookingStatus,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            Pageable pageable) {
        return ResponseEntity.ok(bookingService.search(customerName, bookingStatus, paymentStatus, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a booking by id")
    public ResponseEntity<BookingResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Create a booking (ADMIN or STAFF)")
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.create(request));
    }

    @PatchMapping("/{id}/payment-status")
    @Operation(summary = "Update payment status (ADMIN or STAFF)")
    public ResponseEntity<BookingResponse> updatePaymentStatus(
            @PathVariable Long id, @Valid @RequestBody UpdatePaymentStatusRequest request) {
        return ResponseEntity.ok(bookingService.updatePaymentStatus(id, request.paymentStatus()));
    }

    @PatchMapping("/{id}/booking-status")
    @Operation(summary = "Update booking status (ADMIN or STAFF)")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long id, @Valid @RequestBody UpdateBookingStatusRequest request) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, request.bookingStatus()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a booking (ADMIN only)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

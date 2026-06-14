package com.busms.dto.request;

import com.busms.entity.PaymentStatus;
import jakarta.validation.constraints.NotNull;

public record UpdatePaymentStatusRequest(
        @NotNull PaymentStatus paymentStatus
) {}

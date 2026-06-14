package com.busms.dto.request;

import com.busms.entity.BusStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BusRequest(
        @NotBlank(message = "Bus number is required") String busNumber,
        @NotBlank(message = "Model is required") String model,
        @NotNull @Min(value = 1, message = "Capacity must be at least 1") Integer capacity,
        @NotNull BusStatus status
) {}

package com.busms.dto.response;

import com.busms.entity.BusStatus;

public record BusResponse(
        Long id,
        String busNumber,
        String model,
        Integer capacity,
        BusStatus status
) {}

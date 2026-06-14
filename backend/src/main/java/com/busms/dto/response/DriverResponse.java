package com.busms.dto.response;

public record DriverResponse(
        Long id,
        String name,
        String licenseNumber,
        String phone,
        boolean available
) {}

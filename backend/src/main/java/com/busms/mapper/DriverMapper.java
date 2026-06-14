package com.busms.mapper;

import com.busms.dto.response.DriverResponse;
import com.busms.entity.Driver;

public final class DriverMapper {
    private DriverMapper() {}

    public static DriverResponse toResponse(Driver driver) {
        return new DriverResponse(
                driver.getId(),
                driver.getName(),
                driver.getLicenseNumber(),
                driver.getPhone(),
                driver.isAvailable()
        );
    }
}

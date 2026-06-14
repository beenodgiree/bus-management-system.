package com.busms.mapper;

import com.busms.dto.response.BusResponse;
import com.busms.entity.Bus;

public final class BusMapper {
    private BusMapper() {}

    public static BusResponse toResponse(Bus bus) {
        return new BusResponse(
                bus.getId(),
                bus.getBusNumber(),
                bus.getModel(),
                bus.getCapacity(),
                bus.getStatus()
        );
    }
}

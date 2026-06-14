package com.busms.mapper;

import com.busms.dto.response.ScheduleResponse;
import com.busms.entity.BusSchedule;

public final class ScheduleMapper {
    private ScheduleMapper() {}

    public static ScheduleResponse toResponse(BusSchedule s) {
        return new ScheduleResponse(
                s.getId(),
                s.getOrigin(),
                s.getDestination(),
                s.getDepartureTime(),
                s.getArrivalTime(),
                s.getFare(),
                s.getAvailableSeats(),
                s.getBus().getId(),
                s.getBus().getBusNumber(),
                s.getDriver().getId(),
                s.getDriver().getName()
        );
    }
}

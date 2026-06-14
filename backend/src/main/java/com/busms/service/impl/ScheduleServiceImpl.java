package com.busms.service.impl;

import com.busms.dto.request.ScheduleRequest;
import com.busms.dto.response.PageResponse;
import com.busms.dto.response.ScheduleResponse;
import com.busms.entity.Bus;
import com.busms.entity.BusSchedule;
import com.busms.entity.Driver;
import com.busms.exception.BusinessException;
import com.busms.exception.ResourceNotFoundException;
import com.busms.mapper.ScheduleMapper;
import com.busms.repository.BusRepository;
import com.busms.repository.BusScheduleRepository;
import com.busms.repository.DriverRepository;
import com.busms.service.ScheduleService;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ScheduleServiceImpl implements ScheduleService {

    private final BusScheduleRepository scheduleRepository;
    private final BusRepository busRepository;
    private final DriverRepository driverRepository;

    public ScheduleServiceImpl(BusScheduleRepository scheduleRepository,
                               BusRepository busRepository,
                               DriverRepository driverRepository) {
        this.scheduleRepository = scheduleRepository;
        this.busRepository = busRepository;
        this.driverRepository = driverRepository;
    }

    @Override
    @Transactional
    public ScheduleResponse create(ScheduleRequest request) {
        validateTimes(request);
        Bus bus = loadBus(request.busId());
        Driver driver = loadDriver(request.driverId());

        BusSchedule schedule = BusSchedule.builder()
                .origin(request.origin())
                .destination(request.destination())
                .departureTime(request.departureTime())
                .arrivalTime(request.arrivalTime())
                .fare(request.fare())
                .availableSeats(request.availableSeats())
                .bus(bus)
                .driver(driver)
                .build();
        return ScheduleMapper.toResponse(scheduleRepository.save(schedule));
    }

    @Override
    @Transactional
    public ScheduleResponse update(Long id, ScheduleRequest request) {
        validateTimes(request);
        BusSchedule schedule = findOrThrow(id);
        schedule.setOrigin(request.origin());
        schedule.setDestination(request.destination());
        schedule.setDepartureTime(request.departureTime());
        schedule.setArrivalTime(request.arrivalTime());
        schedule.setFare(request.fare());
        schedule.setAvailableSeats(request.availableSeats());
        schedule.setBus(loadBus(request.busId()));
        schedule.setDriver(loadDriver(request.driverId()));
        return ScheduleMapper.toResponse(scheduleRepository.save(schedule));
    }

    @Override
    public ScheduleResponse getById(Long id) {
        return ScheduleMapper.toResponse(findOrThrow(id));
    }

    @Override
    public PageResponse<ScheduleResponse> search(String origin, String destination, Pageable pageable) {
        String o = (origin == null || origin.isBlank()) ? null : origin;
        String d = (destination == null || destination.isBlank()) ? null : destination;
        return PageResponse.from(scheduleRepository.search(o, d, pageable).map(ScheduleMapper::toResponse));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        scheduleRepository.delete(findOrThrow(id));
    }

    private void validateTimes(ScheduleRequest request) {
        if (!request.arrivalTime().isAfter(request.departureTime())) {
            throw new BusinessException("Arrival time must be after departure time");
        }
    }

    private Bus loadBus(Long busId) {
        return busRepository.findById(busId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus", busId));
    }

    private Driver loadDriver(Long driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", driverId));
    }

    private BusSchedule findOrThrow(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", id));
    }
}

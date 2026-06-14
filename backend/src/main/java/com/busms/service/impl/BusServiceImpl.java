package com.busms.service.impl;

import com.busms.dto.request.BusRequest;
import com.busms.dto.response.BusResponse;
import com.busms.dto.response.PageResponse;
import com.busms.entity.Bus;
import com.busms.exception.DuplicateResourceException;
import com.busms.exception.ResourceNotFoundException;
import com.busms.mapper.BusMapper;
import com.busms.repository.BusRepository;
import com.busms.service.BusService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;

    public BusServiceImpl(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    @Override
    @Transactional
    public BusResponse create(BusRequest request) {
        if (busRepository.existsByBusNumber(request.busNumber())) {
            throw new DuplicateResourceException("Bus number already exists: " + request.busNumber());
        }
        Bus bus = Bus.builder()
                .busNumber(request.busNumber())
                .model(request.model())
                .capacity(request.capacity())
                .status(request.status())
                .build();
        return BusMapper.toResponse(busRepository.save(bus));
    }

    @Override
    @Transactional
    public BusResponse update(Long id, BusRequest request) {
        Bus bus = findOrThrow(id);
        bus.setBusNumber(request.busNumber());
        bus.setModel(request.model());
        bus.setCapacity(request.capacity());
        bus.setStatus(request.status());
        return BusMapper.toResponse(busRepository.save(bus));
    }

    @Override
    public BusResponse getById(Long id) {
        return BusMapper.toResponse(findOrThrow(id));
    }

    @Override
    public PageResponse<BusResponse> search(String busNumber, Pageable pageable) {
        Page<Bus> page = (busNumber == null || busNumber.isBlank())
                ? busRepository.findAll(pageable)
                : busRepository.findByBusNumberContainingIgnoreCase(busNumber, pageable);
        return PageResponse.from(page.map(BusMapper::toResponse));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        busRepository.delete(findOrThrow(id));
    }

    private Bus findOrThrow(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus", id));
    }
}

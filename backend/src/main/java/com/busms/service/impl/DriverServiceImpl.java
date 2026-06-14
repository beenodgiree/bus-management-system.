package com.busms.service.impl;

import com.busms.dto.request.DriverRequest;
import com.busms.dto.response.DriverResponse;
import com.busms.dto.response.PageResponse;
import com.busms.entity.Driver;
import com.busms.exception.DuplicateResourceException;
import com.busms.exception.ResourceNotFoundException;
import com.busms.mapper.DriverMapper;
import com.busms.repository.DriverRepository;
import com.busms.service.DriverService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;

    public DriverServiceImpl(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    @Override
    @Transactional
    public DriverResponse create(DriverRequest request) {
        if (driverRepository.existsByLicenseNumber(request.licenseNumber())) {
            throw new DuplicateResourceException("License number already exists: " + request.licenseNumber());
        }
        Driver driver = Driver.builder()
                .name(request.name())
                .licenseNumber(request.licenseNumber())
                .phone(request.phone())
                .available(request.available())
                .build();
        return DriverMapper.toResponse(driverRepository.save(driver));
    }

    @Override
    @Transactional
    public DriverResponse update(Long id, DriverRequest request) {
        Driver driver = findOrThrow(id);
        driver.setName(request.name());
        driver.setLicenseNumber(request.licenseNumber());
        driver.setPhone(request.phone());
        driver.setAvailable(request.available());
        return DriverMapper.toResponse(driverRepository.save(driver));
    }

    @Override
    public DriverResponse getById(Long id) {
        return DriverMapper.toResponse(findOrThrow(id));
    }

    @Override
    public PageResponse<DriverResponse> search(String name, Pageable pageable) {
        Page<Driver> page = (name == null || name.isBlank())
                ? driverRepository.findAll(pageable)
                : driverRepository.findByNameContainingIgnoreCase(name, pageable);
        return PageResponse.from(page.map(DriverMapper::toResponse));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        driverRepository.delete(findOrThrow(id));
    }

    private Driver findOrThrow(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver", id));
    }
}

package com.busms.service;

import com.busms.dto.request.DriverRequest;
import com.busms.dto.response.DriverResponse;
import com.busms.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface DriverService {
    DriverResponse create(DriverRequest request);
    DriverResponse update(Long id, DriverRequest request);
    DriverResponse getById(Long id);
    PageResponse<DriverResponse> search(String name, Pageable pageable);
    void delete(Long id);
}

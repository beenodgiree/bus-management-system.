package com.busms.service;

import com.busms.dto.request.BusRequest;
import com.busms.dto.response.BusResponse;
import com.busms.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface BusService {
    BusResponse create(BusRequest request);
    BusResponse update(Long id, BusRequest request);
    BusResponse getById(Long id);
    PageResponse<BusResponse> search(String busNumber, Pageable pageable);
    void delete(Long id);
}

package com.busms.service;

import com.busms.dto.request.ScheduleRequest;
import com.busms.dto.response.PageResponse;
import com.busms.dto.response.ScheduleResponse;
import org.springframework.data.domain.Pageable;

public interface ScheduleService {
    ScheduleResponse create(ScheduleRequest request);
    ScheduleResponse update(Long id, ScheduleRequest request);
    ScheduleResponse getById(Long id);
    PageResponse<ScheduleResponse> search(String origin, String destination, Pageable pageable);
    void delete(Long id);
}

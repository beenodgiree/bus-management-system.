package com.busms.repository;

import com.busms.entity.Bus;
import com.busms.entity.BusStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRepository extends JpaRepository<Bus, Long> {
    boolean existsByBusNumber(String busNumber);

    Page<Bus> findByBusNumberContainingIgnoreCase(String busNumber, Pageable pageable);

    long countByStatus(BusStatus status);
}

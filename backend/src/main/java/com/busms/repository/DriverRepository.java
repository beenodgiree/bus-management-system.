package com.busms.repository;

import com.busms.entity.Driver;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    boolean existsByLicenseNumber(String licenseNumber);

    Page<Driver> findByNameContainingIgnoreCase(String name, Pageable pageable);

    long countByAvailableTrue();
}

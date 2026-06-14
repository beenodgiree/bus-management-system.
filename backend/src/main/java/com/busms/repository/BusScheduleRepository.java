package com.busms.repository;

import com.busms.entity.BusSchedule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BusScheduleRepository extends JpaRepository<BusSchedule, Long> {

    /**
     * Search by origin and/or destination. Null parameters are ignored,
     * which lets the same query power the search & filter feature.
     */
    @Query("""
            SELECT s FROM BusSchedule s
            WHERE (:origin IS NULL OR LOWER(s.origin) LIKE LOWER(CONCAT('%', :origin, '%')))
              AND (:destination IS NULL OR LOWER(s.destination) LIKE LOWER(CONCAT('%', :destination, '%')))
            """)
    Page<BusSchedule> search(@Param("origin") String origin,
                             @Param("destination") String destination,
                             Pageable pageable);
}

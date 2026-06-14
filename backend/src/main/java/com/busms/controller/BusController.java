package com.busms.controller;

import com.busms.dto.request.BusRequest;
import com.busms.dto.response.BusResponse;
import com.busms.dto.response.PageResponse;
import com.busms.service.BusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buses")
@Tag(name = "Buses", description = "Bus information management")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping
    @Operation(summary = "List/search buses (paged)")
    public ResponseEntity<PageResponse<BusResponse>> search(
            @RequestParam(required = false) String busNumber, Pageable pageable) {
        return ResponseEntity.ok(busService.search(busNumber, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a bus by id")
    public ResponseEntity<BusResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(busService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a bus (ADMIN only)")
    public ResponseEntity<BusResponse> create(@Valid @RequestBody BusRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(busService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a bus (ADMIN only)")
    public ResponseEntity<BusResponse> update(@PathVariable Long id, @Valid @RequestBody BusRequest request) {
        return ResponseEntity.ok(busService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a bus (ADMIN only)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        busService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

package com.busms.service;

import com.busms.dto.request.BusRequest;
import com.busms.dto.response.BusResponse;
import com.busms.entity.Bus;
import com.busms.entity.BusStatus;
import com.busms.exception.DuplicateResourceException;
import com.busms.exception.ResourceNotFoundException;
import com.busms.repository.BusRepository;
import com.busms.service.impl.BusServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BusServiceImplTest {

    @Mock
    private BusRepository busRepository;

    @InjectMocks
    private BusServiceImpl busService;

    @Test
    void create_savesBus_whenBusNumberIsUnique() {
        BusRequest request = new BusRequest("BUS-9001", "Hino Selega", 45, BusStatus.ACTIVE);
        when(busRepository.existsByBusNumber("BUS-9001")).thenReturn(false);
        when(busRepository.save(any(Bus.class))).thenAnswer(inv -> {
            Bus b = inv.getArgument(0);
            b.setId(1L);
            return b;
        });

        BusResponse response = busService.create(request);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.busNumber()).isEqualTo("BUS-9001");
        assertThat(response.status()).isEqualTo(BusStatus.ACTIVE);
    }

    @Test
    void create_throws_whenBusNumberAlreadyExists() {
        BusRequest request = new BusRequest("BUS-9001", "Hino Selega", 45, BusStatus.ACTIVE);
        when(busRepository.existsByBusNumber("BUS-9001")).thenReturn(true);

        assertThatThrownBy(() -> busService.create(request))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("BUS-9001");
    }

    @Test
    void getById_throws_whenBusNotFound() {
        when(busRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> busService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }
}

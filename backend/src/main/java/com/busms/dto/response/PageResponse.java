package com.busms.dto.response;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Lightweight, framework-agnostic pagination wrapper returned by list endpoints,
 * so the frontend doesn't depend on Spring's internal Page serialization format.
 */
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}

package com.busms.exception;

/** Thrown for domain rule violations (e.g. not enough seats). Maps to HTTP 400. */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}

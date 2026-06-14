-- =====================================================================
-- Bus Management System - reference schema
-- The application auto-generates these tables via JPA (ddl-auto: update).
-- This file documents the schema and lets you create it manually if needed.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS bus_management
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bus_management;

CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    full_name   VARCHAR(100) NOT NULL,
    password    VARCHAR(255) NOT NULL,            -- BCrypt hash
    role        VARCHAR(20)  NOT NULL,            -- ADMIN | STAFF
    enabled     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  DATETIME     NOT NULL,
    updated_at  DATETIME
);

CREATE TABLE IF NOT EXISTS buses (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_number  VARCHAR(20)  NOT NULL UNIQUE,
    model       VARCHAR(50)  NOT NULL,
    capacity    INT          NOT NULL,
    status      VARCHAR(20)  NOT NULL,            -- ACTIVE | MAINTENANCE | INACTIVE
    created_at  DATETIME     NOT NULL,
    updated_at  DATETIME
);

CREATE TABLE IF NOT EXISTS drivers (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    license_number VARCHAR(50)  NOT NULL UNIQUE,
    phone          VARCHAR(20)  NOT NULL,
    available      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at     DATETIME     NOT NULL,
    updated_at     DATETIME
);

CREATE TABLE IF NOT EXISTS bus_schedules (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    origin          VARCHAR(100)   NOT NULL,
    destination     VARCHAR(100)   NOT NULL,
    departure_time  DATETIME       NOT NULL,
    arrival_time    DATETIME       NOT NULL,
    fare            DECIMAL(10,2)  NOT NULL,
    available_seats INT            NOT NULL,
    bus_id          BIGINT         NOT NULL,
    driver_id       BIGINT         NOT NULL,
    created_at      DATETIME       NOT NULL,
    updated_at      DATETIME,
    CONSTRAINT fk_schedule_bus    FOREIGN KEY (bus_id)    REFERENCES buses(id),
    CONSTRAINT fk_schedule_driver FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(30)   NOT NULL UNIQUE,
    customer_name     VARCHAR(100)  NOT NULL,
    customer_email    VARCHAR(120)  NOT NULL,
    customer_phone    VARCHAR(20)   NOT NULL,
    seats_booked      INT           NOT NULL,
    total_amount      DECIMAL(10,2) NOT NULL,
    booking_status    VARCHAR(20)   NOT NULL,     -- PENDING | CONFIRMED | CANCELLED
    payment_status    VARCHAR(20)   NOT NULL,     -- UNPAID | PAID | REFUNDED
    schedule_id       BIGINT        NOT NULL,
    created_at        DATETIME      NOT NULL,
    updated_at        DATETIME,
    CONSTRAINT fk_booking_schedule FOREIGN KEY (schedule_id) REFERENCES bus_schedules(id)
);

CREATE INDEX idx_schedule_route   ON bus_schedules (origin, destination);
CREATE INDEX idx_booking_customer ON bookings (customer_name);
CREATE INDEX idx_booking_status   ON bookings (booking_status, payment_status);

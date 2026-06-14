-- =====================================================================
-- Sample data for the Bus Management System.
-- Loaded automatically when SQL_INIT_MODE=always (see application.yml).
-- NOTE: user accounts (admin/staff) are seeded by DataInitializer.java
--       because their passwords must be BCrypt-hashed at runtime.
-- INSERT ... SELECT ... WHERE NOT EXISTS keeps this script idempotent.
-- =====================================================================

-- ---------- Buses ----------
INSERT INTO buses (bus_number, model, capacity, status, created_at)
SELECT * FROM (SELECT 'BUS-1001','Hino Selega', 45,'ACTIVE', NOW()) t
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE bus_number='BUS-1001');
INSERT INTO buses (bus_number, model, capacity, status, created_at)
SELECT * FROM (SELECT 'BUS-1002','Mitsubishi Aero Ace', 40,'ACTIVE', NOW()) t
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE bus_number='BUS-1002');
INSERT INTO buses (bus_number, model, capacity, status, created_at)
SELECT * FROM (SELECT 'BUS-1003','Isuzu Gala', 50,'MAINTENANCE', NOW()) t
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE bus_number='BUS-1003');
INSERT INTO buses (bus_number, model, capacity, status, created_at)
SELECT * FROM (SELECT 'BUS-1004','Hino Melpha', 28,'ACTIVE', NOW()) t
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE bus_number='BUS-1004');
INSERT INTO buses (bus_number, model, capacity, status, created_at)
SELECT * FROM (SELECT 'BUS-1005','Nissan Civilian', 26,'INACTIVE', NOW()) t
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE bus_number='BUS-1005');

-- ---------- Drivers ----------
INSERT INTO drivers (name, license_number, phone, available, created_at)
SELECT * FROM (SELECT 'Tanaka Hiroshi','DL-2001','090-1234-0001', TRUE, NOW()) t
WHERE NOT EXISTS (SELECT 1 FROM drivers WHERE license_number='DL-2001');
INSERT INTO drivers (name, license_number, phone, available, created_at)
SELECT * FROM (SELECT 'Suzuki Kenji','DL-2002','090-1234-0002', TRUE, NOW()) t
WHERE NOT EXISTS (SELECT 1 FROM drivers WHERE license_number='DL-2002');
INSERT INTO drivers (name, license_number, phone, available, created_at)
SELECT * FROM (SELECT 'Sato Yuki','DL-2003','090-1234-0003', FALSE, NOW()) t
WHERE NOT EXISTS (SELECT 1 FROM drivers WHERE license_number='DL-2003');
INSERT INTO drivers (name, license_number, phone, available, created_at)
SELECT * FROM (SELECT 'Watanabe Akira','DL-2004','090-1234-0004', TRUE, NOW()) t
WHERE NOT EXISTS (SELECT 1 FROM drivers WHERE license_number='DL-2004');

-- ---------- Schedules ----------
INSERT INTO bus_schedules (origin, destination, departure_time, arrival_time, fare, available_seats, bus_id, driver_id, created_at)
SELECT 'Tokyo','Osaka', NOW() + INTERVAL 1 DAY, NOW() + INTERVAL 1 DAY + INTERVAL 8 HOUR, 6500.00, 45,
       (SELECT id FROM buses WHERE bus_number='BUS-1001'),
       (SELECT id FROM drivers WHERE license_number='DL-2001'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM bus_schedules WHERE origin='Tokyo' AND destination='Osaka');

INSERT INTO bus_schedules (origin, destination, departure_time, arrival_time, fare, available_seats, bus_id, driver_id, created_at)
SELECT 'Tokyo','Nagoya', NOW() + INTERVAL 1 DAY, NOW() + INTERVAL 1 DAY + INTERVAL 5 HOUR, 4200.00, 40,
       (SELECT id FROM buses WHERE bus_number='BUS-1002'),
       (SELECT id FROM drivers WHERE license_number='DL-2002'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM bus_schedules WHERE origin='Tokyo' AND destination='Nagoya');

INSERT INTO bus_schedules (origin, destination, departure_time, arrival_time, fare, available_seats, bus_id, driver_id, created_at)
SELECT 'Osaka','Fukuoka', NOW() + INTERVAL 2 DAY, NOW() + INTERVAL 2 DAY + INTERVAL 9 HOUR, 7800.00, 28,
       (SELECT id FROM buses WHERE bus_number='BUS-1004'),
       (SELECT id FROM drivers WHERE license_number='DL-2004'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM bus_schedules WHERE origin='Osaka' AND destination='Fukuoka');

-- ---------- Bookings ----------
INSERT INTO bookings (booking_reference, customer_name, customer_email, customer_phone, seats_booked, total_amount, booking_status, payment_status, schedule_id, created_at)
SELECT 'BK-SAMPLE01','Yamada Taro','taro.yamada@example.com','080-5555-0001', 2, 13000.00, 'CONFIRMED','PAID',
       (SELECT id FROM bus_schedules WHERE origin='Tokyo' AND destination='Osaka'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE booking_reference='BK-SAMPLE01');

INSERT INTO bookings (booking_reference, customer_name, customer_email, customer_phone, seats_booked, total_amount, booking_status, payment_status, schedule_id, created_at)
SELECT 'BK-SAMPLE02','Nakamura Hana','hana.nakamura@example.com','080-5555-0002', 1, 4200.00, 'PENDING','UNPAID',
       (SELECT id FROM bus_schedules WHERE origin='Tokyo' AND destination='Nagoya'), NOW()
WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE booking_reference='BK-SAMPLE02');

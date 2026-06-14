# 🚌 Bus Management System

A full-stack bus operations management system built with **Spring Boot 3** and **React + TypeScript**. It covers fleet, driver, schedule and booking management with role-based access control, JWT authentication, a statistics dashboard, and a clean, responsive operations console UI.

> このプロジェクトは、バス運行管理を題材にしたフルスタックWebアプリケーションのポートフォリオです。Spring Boot（バックエンド）とReact + TypeScript（フロントエンド）でクリーンアーキテクチャに沿って実装しています。

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Technologies](#-technologies)
4. [Architecture](#-architecture)
5. [Project Structure](#-project-structure)
6. [Getting Started](#-getting-started)
7. [Default Accounts](#-default-accounts)
8. [API Documentation](#-api-documentation)
9. [Testing](#-testing)
10. [Screenshots](#-screenshots)
11. [Future Improvements](#-future-improvements)

---

## 📖 Overview

The Bus Management System is an internal tool that a regional bus operator's staff would use to manage day-to-day operations. Administrators maintain the fleet, drivers and schedules; staff handle customer bookings and payment tracking. A dashboard summarises fleet utilisation, booking activity and revenue.

The project was built to demonstrate production-style engineering practices end-to-end: a layered Spring Boot backend with a secured REST API, a typed React front end, automated tests, containerisation, and clear documentation.

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Authentication & roles** | JWT-based login with two roles — `ADMIN` (full control) and `STAFF` (bookings & viewing). |
| 2 | **Bus management** | Full CRUD over the fleet with status tracking (`ACTIVE` / `MAINTENANCE` / `INACTIVE`). |
| 3 | **Driver management** | Driver roster with licence numbers, contact details and availability. |
| 4 | **Schedule management** | Routes with departure/arrival times, fares, seat counts, and assigned bus + driver. |
| 5 | **Booking management** | Create bookings, auto-generated references, automatic seat decrement and total calculation. |
| 6 | **Payment status tracking** | Track `UNPAID` / `PAID` / `REFUNDED`; marking a booking paid auto-confirms it. |
| 7 | **Dashboard & statistics** | Aggregated counts and paid revenue, visualised with charts. |
| 8 | **Search & filter** | Server-side search and filtering on buses, drivers, schedules and bookings. |
| 9 | **Responsive UI** | Operations-console layout that adapts from desktop to mobile. |
| 10 | **Validation & error handling** | Bean Validation on requests + a global exception handler returning consistent error payloads. |

---

## 🛠 Technologies

**Backend**
- Java 17, Spring Boot 3.3
- Spring Web, Spring Data JPA, Spring Security (JWT)
- Bean Validation (Jakarta)
- MySQL 8 (H2 for tests)
- springdoc-openapi (Swagger UI)
- Maven, Lombok

**Frontend**
- React 18, TypeScript 5
- Vite 5
- React Router 6
- Axios
- Recharts

**Tooling**
- Docker & Docker Compose
- JUnit 5, Mockito, Spring Boot Test, MockMvc
- Git / GitHub

---

## 🏗 Architecture

The backend follows a conventional layered (clean) architecture, keeping each concern isolated and testable:

```
Controller  →  Service (interface)  →  Repository  →  Database
    │               │
   DTO          Domain entity
    │
 Validation / Mapper / Global exception handling
```

- **Controllers** expose REST endpoints, validate input and delegate to services. They never touch entities directly.
- **DTOs** (Java `record`s) define the request/response contracts, decoupling the API from the persistence model.
- **Services** hold business rules (seat availability, total calculation, status transitions) behind interfaces, so implementations can be swapped or mocked.
- **Repositories** (Spring Data JPA) handle persistence with derived and custom queries.
- **Mappers** convert entities to response DTOs in one place.
- **Security** is stateless: a JWT filter authenticates each request and method-level `@PreAuthorize` enforces roles.
- A **global exception handler** (`@RestControllerAdvice`) turns exceptions into a consistent `ApiError` JSON shape.

The frontend mirrors this separation: a typed API layer (`api/`), shared domain `types/`, an auth `context/`, reusable `components/`, and route-level `pages/`.

---

## 📁 Project Structure

```
bus-management-system/
├── backend/
│   ├── src/main/java/com/busms/
│   │   ├── config/            # Security, OpenAPI, JPA auditing, data seeding
│   │   ├── controller/        # REST controllers
│   │   ├── dto/               # Request & response records
│   │   ├── entity/            # JPA entities & enums
│   │   ├── exception/         # Custom exceptions + global handler
│   │   ├── mapper/            # Entity → DTO mappers
│   │   ├── repository/        # Spring Data JPA repositories
│   │   ├── security/          # JWT service, filter, user details
│   │   └── service/           # Service interfaces + impl
│   ├── src/main/resources/    # application.yml (+ test profile)
│   ├── src/test/java/         # Unit & integration tests
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios client + service modules
│   │   ├── components/        # Layout, ProtectedRoute, Modal, Badge
│   │   ├── context/           # AuthContext
│   │   ├── pages/             # Login, Dashboard, Buses, Drivers, Schedules, Bookings
│   │   ├── types/             # Shared TypeScript types
│   │   └── utils/             # Formatting helpers
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── database/
│   ├── schema.sql             # Reference DDL
│   └── data.sql               # Idempotent sample data
├── docs/screenshots/          # Place UI screenshots here
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Option A — Docker Compose (recommended)

The fastest way to run everything (MySQL + backend + frontend):

```bash
git clone https://github.com/<your-username>/bus-management-system.git
cd bus-management-system
docker compose up --build
```

Then open:
- **Frontend:** http://localhost:5173
- **Swagger UI:** http://localhost:8080/swagger-ui.html

Sample data is loaded automatically (the compose file sets `SQL_INIT_MODE=always`).

### Option B — Run locally

**Prerequisites:** JDK 17, Node.js 20+, MySQL 8 (running on `localhost:3306`).

**1. Backend**
```bash
cd backend
# Configure DB via env vars or edit src/main/resources/application.yml
export DB_USERNAME=root DB_PASSWORD=root SQL_INIT_MODE=always
mvn spring-boot:run
```
The schema is created automatically (`ddl-auto: update`) and the database is created on first connection.

**2. Frontend**
```bash
cd frontend
npm install
npm run dev
```
Vite serves the app on http://localhost:5173 and proxies `/api` to the backend on port 8080.

---

## 🔑 Default Accounts

Seeded automatically on first start by `DataInitializer`:

| Role  | Username | Password   | Capabilities |
|-------|----------|------------|--------------|
| Admin | `admin`  | `admin123` | Full CRUD on all resources |
| Staff | `staff`  | `staff123` | Bookings + read-only on the rest |

> ⚠️ These are demo credentials. Change them (and the JWT secret) before any real deployment.

---

## 📚 API Documentation

Interactive Swagger UI is available at **`/swagger-ui.html`** once the backend is running. Use the **Authorize** button with a JWT from the login endpoint to call secured endpoints.

### Key endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | Public | Authenticate, returns a JWT |
| `POST` | `/api/auth/register` | Admin | Create a new user |
| `GET` | `/api/dashboard/stats` | Admin/Staff | Aggregated statistics |
| `GET` | `/api/buses` | Admin/Staff | List buses (paged, searchable) |
| `POST` `PUT` `DELETE` | `/api/buses/**` | Admin | Manage buses |
| `GET` | `/api/drivers` | Admin/Staff | List drivers (paged, searchable) |
| `POST` `PUT` `DELETE` | `/api/drivers/**` | Admin | Manage drivers |
| `GET` | `/api/schedules` | Admin/Staff | List schedules (filter by origin/destination) |
| `POST` `PUT` `DELETE` | `/api/schedules/**` | Admin | Manage schedules |
| `GET` | `/api/bookings` | Admin/Staff | List bookings (filter by name/status) |
| `POST` | `/api/bookings` | Admin/Staff | Create a booking |
| `PATCH` | `/api/bookings/{id}/payment-status` | Admin/Staff | Update payment status |
| `PATCH` | `/api/bookings/{id}/booking-status` | Admin/Staff | Update booking status |

### Example: login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "username": "admin",
  "fullName": "System Administrator",
  "role": "ADMIN"
}
```

Use the token on subsequent requests: `Authorization: Bearer <token>`.

---

## 🧪 Testing

```bash
cd backend
mvn test
```

The suite uses an in-memory H2 database (`test` profile) and includes:
- **Service unit tests** (Mockito) — duplicate detection, seat decrement + total calculation, payment-confirms-booking logic, not-found handling.
- **Controller integration tests** (MockMvc + Spring Security) — successful JWT login flow, wrong-password → 401, missing-token → 403.

---

## 📸 Screenshots

Screenshots live in [`docs/screenshots/`](docs/screenshots/). Add yours and reference them here:

| Login | Dashboard |
|-------|-----------|
| ![Login](docs/screenshots/login.png) | ![Dashboard](docs/screenshots/dashboard.png) |

| Buses | Bookings |
|-------|----------|
| ![Buses](docs/screenshots/buses.png) | ![Bookings](docs/screenshots/bookings.png) |

---

## 🔮 Future Improvements

- **Customer-facing portal** for self-service booking and seat selection.
- **Real seat-map** selection rather than a seat count.
- **Refresh tokens** and token rotation for longer sessions.
- **Audit log** of who changed what and when.
- **Reporting** — exportable revenue and occupancy reports (CSV/PDF).
- **Notifications** — email/SMS booking confirmations.
- **CI/CD** — GitHub Actions pipeline running tests and building images.
- **Internationalisation** — full English/Japanese UI toggle.
- **Observability** — structured logging, metrics and tracing.

---

## 📄 License

Released under the MIT License — free to use as a learning and portfolio reference.

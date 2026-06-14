// Shared domain types — kept in sync with the backend DTOs (com.busms.dto).

export type Role = 'ADMIN' | 'STAFF';
export type BusStatus = 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface AuthResponse {
  token: string;
  tokenType: string;
  username: string;
  fullName: string;
  role: Role;
}

export interface AuthUser {
  username: string;
  fullName: string;
  role: Role;
}

export interface Bus {
  id: number;
  busNumber: string;
  model: string;
  capacity: number;
  status: BusStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  phone: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: number;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  availableSeats: number;
  busId: number;
  busNumber: string;
  driverId: number;
  driverName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  seatsBooked: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  scheduleId: number;
  origin: string;
  destination: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalBuses: number;
  activeBuses: number;
  totalDrivers: number;
  availableDrivers: number;
  totalSchedules: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  paidBookings: number;
  totalRevenue: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Request payload shapes
export interface BusRequest {
  busNumber: string;
  model: string;
  capacity: number;
  status: BusStatus;
}

export interface DriverRequest {
  name: string;
  licenseNumber: string;
  phone: string;
  available: boolean;
}

export interface ScheduleRequest {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  availableSeats: number;
  busId: number;
  driverId: number;
}

export interface BookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  seatsBooked: number;
  scheduleId: number;
}

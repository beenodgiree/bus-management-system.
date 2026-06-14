import client from './client';
import type {
  AuthResponse,
  Bus,
  BusRequest,
  Driver,
  DriverRequest,
  Schedule,
  ScheduleRequest,
  Booking,
  BookingRequest,
  BookingStatus,
  PaymentStatus,
  DashboardStats,
  PageResponse,
} from '../types';

export const authApi = {
  login: (username: string, password: string) =>
    client.post<AuthResponse>('/auth/login', { username, password }).then((r) => r.data),
};

export const busApi = {
  list: (page = 0, size = 10, search = '') =>
    client
      .get<PageResponse<Bus>>('/buses', { params: { page, size, search: search || undefined } })
      .then((r) => r.data),
  get: (id: number) => client.get<Bus>(`/buses/${id}`).then((r) => r.data),
  create: (body: BusRequest) => client.post<Bus>('/buses', body).then((r) => r.data),
  update: (id: number, body: BusRequest) =>
    client.put<Bus>(`/buses/${id}`, body).then((r) => r.data),
  remove: (id: number) => client.delete(`/buses/${id}`).then((r) => r.data),
};

export const driverApi = {
  list: (page = 0, size = 10, search = '') =>
    client
      .get<PageResponse<Driver>>('/drivers', { params: { page, size, search: search || undefined } })
      .then((r) => r.data),
  create: (body: DriverRequest) => client.post<Driver>('/drivers', body).then((r) => r.data),
  update: (id: number, body: DriverRequest) =>
    client.put<Driver>(`/drivers/${id}`, body).then((r) => r.data),
  remove: (id: number) => client.delete(`/drivers/${id}`).then((r) => r.data),
};

export const scheduleApi = {
  list: (page = 0, size = 10, origin = '', destination = '') =>
    client
      .get<PageResponse<Schedule>>('/schedules', {
        params: { page, size, origin: origin || undefined, destination: destination || undefined },
      })
      .then((r) => r.data),
  create: (body: ScheduleRequest) => client.post<Schedule>('/schedules', body).then((r) => r.data),
  update: (id: number, body: ScheduleRequest) =>
    client.put<Schedule>(`/schedules/${id}`, body).then((r) => r.data),
  remove: (id: number) => client.delete(`/schedules/${id}`).then((r) => r.data),
};

export const bookingApi = {
  list: (page = 0, size = 10, customerName = '', bookingStatus?: BookingStatus, paymentStatus?: PaymentStatus) =>
    client
      .get<PageResponse<Booking>>('/bookings', {
        params: {
          page,
          size,
          customerName: customerName || undefined,
          bookingStatus: bookingStatus || undefined,
          paymentStatus: paymentStatus || undefined,
        },
      })
      .then((r) => r.data),
  create: (body: BookingRequest) => client.post<Booking>('/bookings', body).then((r) => r.data),
  updatePaymentStatus: (id: number, paymentStatus: PaymentStatus) =>
    client.patch<Booking>(`/bookings/${id}/payment-status`, { paymentStatus }).then((r) => r.data),
  updateBookingStatus: (id: number, bookingStatus: BookingStatus) =>
    client.patch<Booking>(`/bookings/${id}/booking-status`, { bookingStatus }).then((r) => r.data),
};

export const dashboardApi = {
  stats: () => client.get<DashboardStats>('/dashboard/stats').then((r) => r.data),
};

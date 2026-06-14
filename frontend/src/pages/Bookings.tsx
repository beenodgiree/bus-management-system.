import { useEffect, useState, useCallback } from 'react';
import { bookingApi, scheduleApi } from '../api/services';
import { extractError } from '../api/client';
import { tones, formatYen } from '../utils/format';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import type {
  Booking,
  BookingRequest,
  BookingStatus,
  PaymentStatus,
  Schedule,
  PageResponse,
} from '../types';

const BOOKING_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED'];
const PAYMENT_STATUSES: PaymentStatus[] = ['UNPAID', 'PAID', 'REFUNDED'];

const EMPTY: BookingRequest = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  seatsBooked: 1,
  scheduleId: 0,
};

export default function Bookings() {
  const [data, setData] = useState<PageResponse<Booking> | null>(null);
  const [page, setPage] = useState(0);
  const [name, setName] = useState('');
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | ''>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<BookingRequest>(EMPTY);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(
        await bookingApi.list(
          page,
          10,
          name,
          bookingStatus || undefined,
          paymentStatus || undefined
        )
      );
    } catch (e) {
      setError(extractError(e));
    } finally {
      setLoading(false);
    }
  }, [page, name, bookingStatus, paymentStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm(EMPTY);
    setFormError('');
    setModalOpen(true);
    // Pull schedules with seats for the selector.
    scheduleApi
      .list(0, 100)
      .then((r) => {
        setSchedules(r.content);
        setForm((f) => ({ ...f, scheduleId: r.content[0]?.id ?? 0 }));
      })
      .catch(() => undefined);
  };

  const save = async () => {
    setSaving(true);
    setFormError('');
    try {
      await bookingApi.create(form);
      setModalOpen(false);
      load();
    } catch (e) {
      setFormError(extractError(e));
    } finally {
      setSaving(false);
    }
  };

  const changePayment = async (b: Booking, status: PaymentStatus) => {
    try {
      await bookingApi.updatePaymentStatus(b.id, status);
      load();
    } catch (e) {
      setError(extractError(e));
    }
  };

  const changeBooking = async (b: Booking, status: BookingStatus) => {
    try {
      await bookingApi.updateBookingStatus(b.id, status);
      load();
    } catch (e) {
      setError(extractError(e));
    }
  };

  return (
    <div className="page">
      <div className="page__head page__head--row">
        <div>
          <h2>Bookings</h2>
          <p className="page__sub">Customer reservations, payment and status</p>
        </div>
        <button className="btn btn--accent" onClick={openCreate}>
          + New booking
        </button>
      </div>

      <div className="toolbar">
        <input
          className="toolbar__search"
          placeholder="Customer name…"
          value={name}
          onChange={(e) => {
            setPage(0);
            setName(e.target.value);
          }}
        />
        <select
          className="toolbar__select"
          value={bookingStatus}
          onChange={(e) => {
            setPage(0);
            setBookingStatus(e.target.value as BookingStatus | '');
          }}
        >
          <option value="">All booking statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="toolbar__select"
          value={paymentStatus}
          onChange={(e) => {
            setPage(0);
            setPaymentStatus(e.target.value as PaymentStatus | '');
          }}
        >
          <option value="">All payment statuses</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="panel panel--flush">
        <table className="table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Customer</th>
              <th>Route</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Booking</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="table__empty">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && data?.content.length === 0 && (
              <tr>
                <td colSpan={7} className="table__empty">
                  No bookings found.
                </td>
              </tr>
            )}
            {!loading &&
              data?.content.map((b) => (
                <tr key={b.id}>
                  <td className="mono">{b.bookingReference}</td>
                  <td>
                    <div className="cell-stack">
                      <strong>{b.customerName}</strong>
                      <span className="cell-sub">{b.customerEmail}</span>
                    </div>
                  </td>
                  <td className="route">
                    {b.origin} <span className="route__arrow">→</span> {b.destination}
                  </td>
                  <td>{b.seatsBooked}</td>
                  <td className="mono">{formatYen(b.totalAmount)}</td>
                  <td>
                    <div className="cell-action">
                      <Badge tone={tones.bookingTone[b.bookingStatus]} label={b.bookingStatus} />
                      <select
                        className="inline-select"
                        value={b.bookingStatus}
                        onChange={(e) => changeBooking(b, e.target.value as BookingStatus)}
                      >
                        {BOOKING_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="cell-action">
                      <Badge tone={tones.paymentTone[b.paymentStatus]} label={b.paymentStatus} />
                      <select
                        className="inline-select"
                        value={b.paymentStatus}
                        onChange={(e) => changePayment(b, e.target.value as PaymentStatus)}
                      >
                        {PAYMENT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn--ghost btn--sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span>
            Page {data.page + 1} of {data.totalPages}
          </span>
          <button className="btn btn--ghost btn--sm" disabled={data.last} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}

      <Modal
        open={modalOpen}
        title="New booking"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn--ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Create booking'}
            </button>
          </>
        }
      >
        {formError && <div className="alert alert--danger">{formError}</div>}
        <label className="field">
          <span>Schedule</span>
          <select
            value={form.scheduleId}
            onChange={(e) => setForm({ ...form, scheduleId: Number(e.target.value) })}
          >
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.origin} → {s.destination} · {formatYen(s.fare)} · {s.availableSeats} seats
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Customer name</span>
          <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Phone</span>
            <input
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
            />
          </label>
        </div>
        <label className="field">
          <span>Seats</span>
          <input
            type="number"
            min={1}
            value={form.seatsBooked}
            onChange={(e) => setForm({ ...form, seatsBooked: Number(e.target.value) })}
          />
        </label>
      </Modal>
    </div>
  );
}

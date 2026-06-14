import { useEffect, useState, useCallback } from 'react';
import { scheduleApi, busApi, driverApi } from '../api/services';
import { extractError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatYen, formatDateTime } from '../utils/format';
import Modal from '../components/Modal';
import type { Schedule, ScheduleRequest, Bus, Driver, PageResponse } from '../types';

const EMPTY: ScheduleRequest = {
  origin: '',
  destination: '',
  departureTime: '',
  arrivalTime: '',
  fare: 0,
  availableSeats: 40,
  busId: 0,
  driverId: 0,
};

// <input type="datetime-local"> works without the seconds/zone the API returns.
function toLocalInput(iso: string): string {
  if (!iso) return '';
  return iso.slice(0, 16);
}

export default function Schedules() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [data, setData] = useState<PageResponse<Schedule> | null>(null);
  const [page, setPage] = useState(0);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [buses, setBuses] = useState<Bus[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [form, setForm] = useState<ScheduleRequest>(EMPTY);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await scheduleApi.list(page, 10, origin, destination));
    } catch (e) {
      setError(extractError(e));
    } finally {
      setLoading(false);
    }
  }, [page, origin, destination]);

  useEffect(() => {
    load();
  }, [load]);

  // Load selector options once (large page size to capture all).
  useEffect(() => {
    if (!isAdmin) return;
    busApi.list(0, 100).then((r) => setBuses(r.content)).catch(() => undefined);
    driverApi.list(0, 100).then((r) => setDrivers(r.content)).catch(() => undefined);
  }, [isAdmin]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, busId: buses[0]?.id ?? 0, driverId: drivers[0]?.id ?? 0 });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (s: Schedule) => {
    setEditing(s);
    setForm({
      origin: s.origin,
      destination: s.destination,
      departureTime: toLocalInput(s.departureTime),
      arrivalTime: toLocalInput(s.arrivalTime),
      fare: s.fare,
      availableSeats: s.availableSeats,
      busId: s.busId,
      driverId: s.driverId,
    });
    setFormError('');
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setFormError('');
    try {
      if (editing) await scheduleApi.update(editing.id, form);
      else await scheduleApi.create(form);
      setModalOpen(false);
      load();
    } catch (e) {
      setFormError(extractError(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s: Schedule) => {
    if (!window.confirm(`Delete schedule ${s.origin} → ${s.destination}?`)) return;
    try {
      await scheduleApi.remove(s.id);
      load();
    } catch (e) {
      setError(extractError(e));
    }
  };

  return (
    <div className="page">
      <div className="page__head page__head--row">
        <div>
          <h2>Schedules</h2>
          <p className="page__sub">Routes, timings and seat availability</p>
        </div>
        {isAdmin && (
          <button className="btn btn--accent" onClick={openCreate}>
            + Add schedule
          </button>
        )}
      </div>

      <div className="toolbar">
        <input
          className="toolbar__search"
          placeholder="Origin…"
          value={origin}
          onChange={(e) => {
            setPage(0);
            setOrigin(e.target.value);
          }}
        />
        <input
          className="toolbar__search"
          placeholder="Destination…"
          value={destination}
          onChange={(e) => {
            setPage(0);
            setDestination(e.target.value);
          }}
        />
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="panel panel--flush">
        <table className="table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Fare</th>
              <th>Seats</th>
              <th>Bus</th>
              <th>Driver</th>
              {isAdmin && <th className="table__actions">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="table__empty">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && data?.content.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="table__empty">
                  No schedules found.
                </td>
              </tr>
            )}
            {!loading &&
              data?.content.map((s) => (
                <tr key={s.id}>
                  <td className="route">
                    {s.origin} <span className="route__arrow">→</span> {s.destination}
                  </td>
                  <td>{formatDateTime(s.departureTime)}</td>
                  <td>{formatDateTime(s.arrivalTime)}</td>
                  <td className="mono">{formatYen(s.fare)}</td>
                  <td>{s.availableSeats}</td>
                  <td className="mono">{s.busNumber}</td>
                  <td>{s.driverName}</td>
                  {isAdmin && (
                    <td className="table__actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(s)}>
                        Edit
                      </button>
                      <button className="btn btn--danger btn--sm" onClick={() => remove(s)}>
                        Delete
                      </button>
                    </td>
                  )}
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
        title={editing ? 'Edit schedule' : 'Add schedule'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn--ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        {formError && <div className="alert alert--danger">{formError}</div>}
        <div className="field-row">
          <label className="field">
            <span>Origin</span>
            <input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
          </label>
          <label className="field">
            <span>Destination</span>
            <input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Departure</span>
            <input
              type="datetime-local"
              value={form.departureTime}
              onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Arrival</span>
            <input
              type="datetime-local"
              value={form.arrivalTime}
              onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
            />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Fare (JPY)</span>
            <input
              type="number"
              min={0}
              value={form.fare}
              onChange={(e) => setForm({ ...form, fare: Number(e.target.value) })}
            />
          </label>
          <label className="field">
            <span>Available seats</span>
            <input
              type="number"
              min={0}
              value={form.availableSeats}
              onChange={(e) => setForm({ ...form, availableSeats: Number(e.target.value) })}
            />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>Bus</span>
            <select value={form.busId} onChange={(e) => setForm({ ...form, busId: Number(e.target.value) })}>
              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.busNumber} — {b.model}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Driver</span>
            <select value={form.driverId} onChange={(e) => setForm({ ...form, driverId: Number(e.target.value) })}>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Modal>
    </div>
  );
}

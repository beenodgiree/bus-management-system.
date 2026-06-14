import { useEffect, useState, useCallback } from 'react';
import { busApi } from '../api/services';
import { extractError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { tones } from '../utils/format';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import type { Bus, BusRequest, BusStatus, PageResponse } from '../types';

const STATUSES: BusStatus[] = ['ACTIVE', 'MAINTENANCE', 'INACTIVE'];
const EMPTY: BusRequest = { busNumber: '', model: '', capacity: 40, status: 'ACTIVE' };

export default function Buses() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [data, setData] = useState<PageResponse<Bus> | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Bus | null>(null);
  const [form, setForm] = useState<BusRequest>(EMPTY);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await busApi.list(page, 10, search));
    } catch (e) {
      setError(extractError(e));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (bus: Bus) => {
    setEditing(bus);
    setForm({ busNumber: bus.busNumber, model: bus.model, capacity: bus.capacity, status: bus.status });
    setFormError('');
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setFormError('');
    try {
      if (editing) {
        await busApi.update(editing.id, form);
      } else {
        await busApi.create(form);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      setFormError(extractError(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (bus: Bus) => {
    if (!window.confirm(`Delete bus ${bus.busNumber}?`)) return;
    try {
      await busApi.remove(bus.id);
      load();
    } catch (e) {
      setError(extractError(e));
    }
  };

  return (
    <div className="page">
      <div className="page__head page__head--row">
        <div>
          <h2>Buses</h2>
          <p className="page__sub">Fleet inventory and service status</p>
        </div>
        {isAdmin && (
          <button className="btn btn--accent" onClick={openCreate}>
            + Add bus
          </button>
        )}
      </div>

      <div className="toolbar">
        <input
          className="toolbar__search"
          placeholder="Search by bus number…"
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
        />
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="panel panel--flush">
        <table className="table">
          <thead>
            <tr>
              <th>Bus #</th>
              <th>Model</th>
              <th>Capacity</th>
              <th>Status</th>
              {isAdmin && <th className="table__actions">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="table__empty">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && data?.content.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="table__empty">
                  No buses found.
                </td>
              </tr>
            )}
            {!loading &&
              data?.content.map((bus) => (
                <tr key={bus.id}>
                  <td className="mono">{bus.busNumber}</td>
                  <td>{bus.model}</td>
                  <td>{bus.capacity}</td>
                  <td>
                    <Badge tone={tones.busTone[bus.status]} label={bus.status} />
                  </td>
                  {isAdmin && (
                    <td className="table__actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(bus)}>
                        Edit
                      </button>
                      <button className="btn btn--danger btn--sm" onClick={() => remove(bus)}>
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
          <button
            className="btn btn--ghost btn--sm"
            disabled={data.last}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? `Edit ${editing.busNumber}` : 'Add bus'}
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
        <label className="field">
          <span>Bus number</span>
          <input
            value={form.busNumber}
            onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
            placeholder="e.g. BUS-101"
          />
        </label>
        <label className="field">
          <span>Model</span>
          <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
        </label>
        <label className="field">
          <span>Capacity</span>
          <input
            type="number"
            min={1}
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
          />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BusStatus })}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </Modal>
    </div>
  );
}

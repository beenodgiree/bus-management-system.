import { useEffect, useState, useCallback } from 'react';
import { driverApi } from '../api/services';
import { extractError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import type { Driver, DriverRequest, PageResponse } from '../types';

const EMPTY: DriverRequest = { name: '', licenseNumber: '', phone: '', available: true };

export default function Drivers() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [data, setData] = useState<PageResponse<Driver> | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [form, setForm] = useState<DriverRequest>(EMPTY);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await driverApi.list(page, 10, search));
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

  const openEdit = (d: Driver) => {
    setEditing(d);
    setForm({ name: d.name, licenseNumber: d.licenseNumber, phone: d.phone, available: d.available });
    setFormError('');
    setModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setFormError('');
    try {
      if (editing) await driverApi.update(editing.id, form);
      else await driverApi.create(form);
      setModalOpen(false);
      load();
    } catch (e) {
      setFormError(extractError(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (d: Driver) => {
    if (!window.confirm(`Delete driver ${d.name}?`)) return;
    try {
      await driverApi.remove(d.id);
      load();
    } catch (e) {
      setError(extractError(e));
    }
  };

  return (
    <div className="page">
      <div className="page__head page__head--row">
        <div>
          <h2>Drivers</h2>
          <p className="page__sub">Roster and availability</p>
        </div>
        {isAdmin && (
          <button className="btn btn--accent" onClick={openCreate}>
            + Add driver
          </button>
        )}
      </div>

      <div className="toolbar">
        <input
          className="toolbar__search"
          placeholder="Search by name…"
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
              <th>Name</th>
              <th>License #</th>
              <th>Phone</th>
              <th>Availability</th>
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
                  No drivers found.
                </td>
              </tr>
            )}
            {!loading &&
              data?.content.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td className="mono">{d.licenseNumber}</td>
                  <td>{d.phone}</td>
                  <td>
                    <Badge tone={d.available ? 'ok' : 'muted'} label={d.available ? 'AVAILABLE' : 'OFF DUTY'} />
                  </td>
                  {isAdmin && (
                    <td className="table__actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(d)}>
                        Edit
                      </button>
                      <button className="btn btn--danger btn--sm" onClick={() => remove(d)}>
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
        title={editing ? `Edit ${editing.name}` : 'Add driver'}
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
          <span>Name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="field">
          <span>License number</span>
          <input
            value={form.licenseNumber}
            onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
            placeholder="e.g. DL-2024001"
          />
        </label>
        <label className="field">
          <span>Phone</span>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="e.g. 090-1234-5678"
          />
        </label>
        <label className="field field--check">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
          />
          <span>Available for assignment</span>
        </label>
      </Modal>
    </div>
  );
}

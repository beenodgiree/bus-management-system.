import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { dashboardApi } from '../api/services';
import { extractError } from '../api/client';
import { formatYen } from '../utils/format';
import type { DashboardStats } from '../types';

const AMBER = '#F5A623';
const NAVY = '#0F2A43';
const OK = '#1F9D55';
const DANGER = '#C0392B';
const INFO = '#2F80ED';

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`stat${accent ? ' stat--accent' : ''}`}>
      <span className="stat__label">{label}</span>
      <span className="stat__value">{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi
      .stats()
      .then(setStats)
      .catch((e) => setError(extractError(e)));
  }, []);

  if (error) return <div className="alert alert--danger">{error}</div>;
  if (!stats) return <div className="loading">Loading dashboard…</div>;

  const bookingData = [
    { name: 'Pending', value: stats.pendingBookings, color: AMBER },
    { name: 'Confirmed', value: stats.confirmedBookings, color: OK },
    { name: 'Cancelled', value: stats.cancelledBookings, color: DANGER },
  ];

  const fleetData = [
    { name: 'Buses', total: stats.totalBuses, active: stats.activeBuses },
    { name: 'Drivers', total: stats.totalDrivers, active: stats.availableDrivers },
  ];

  return (
    <div className="page">
      <div className="page__head">
        <h2>Dashboard</h2>
        <p className="page__sub">Fleet, schedules and booking activity at a glance</p>
      </div>

      <section className="stat-grid">
        <StatCard label="Total revenue (paid)" value={formatYen(stats.totalRevenue)} accent />
        <StatCard label="Total bookings" value={stats.totalBookings} />
        <StatCard label="Active buses" value={`${stats.activeBuses} / ${stats.totalBuses}`} />
        <StatCard label="Available drivers" value={`${stats.availableDrivers} / ${stats.totalDrivers}`} />
        <StatCard label="Schedules" value={stats.totalSchedules} />
        <StatCard label="Paid bookings" value={stats.paidBookings} />
      </section>

      <section className="chart-grid">
        <div className="panel">
          <h3 className="panel__title">Bookings by status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={bookingData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {bookingData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend">
            {bookingData.map((d) => (
              <span key={d.name} className="legend__item">
                <i style={{ background: d.color }} /> {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3 className="panel__title">Fleet utilisation</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={fleetData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
              <Tooltip />
              <Bar dataKey="total" name="Total" fill={NAVY} radius={[4, 4, 0, 0]} />
              <Bar dataKey="active" name="Active / Available" fill={INFO} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

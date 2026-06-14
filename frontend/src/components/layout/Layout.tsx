import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/', label: 'Dashboard', end: true, icon: '▦' },
  { to: '/buses', label: 'Buses', icon: '▣' },
  { to: '/drivers', label: 'Drivers', icon: '◑' },
  { to: '/schedules', label: 'Schedules', icon: '◔' },
  { to: '/bookings', label: 'Bookings', icon: '◧' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <img src="/bus.svg" alt="" width={28} height={28} />
          <span>BusMS</span>
        </div>
        <nav className="sidebar__nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              <span className="nav-link__icon" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__foot">
          <p className="sidebar__hint">Operations Console</p>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar__title">Bus Management System</div>
          <div className="topbar__user">
            <div className="topbar__id">
              <span className="topbar__name">{user?.fullName}</span>
              <span className={`badge badge--${user?.role === 'ADMIN' ? 'info' : 'muted'}`}>
                {user?.role}
              </span>
            </div>
            <button className="btn btn--ghost" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

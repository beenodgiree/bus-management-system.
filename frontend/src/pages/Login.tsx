import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractError } from '../api/client';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__brand">
          <img src="/bus.svg" alt="" width={40} height={40} />
          <div>
            <h1>Bus Management System</h1>
            <p>Operations console — sign in to continue</p>
          </div>
        </div>

        <form onSubmit={submit} className="login__form">
          <label className="field">
            <span>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="alert alert--danger">{error}</div>}

          <button className="btn btn--primary btn--block" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="login__demo">
          <p>Demo accounts</p>
          <div className="login__demo-row">
            <button type="button" className="btn btn--ghost" onClick={() => quickFill('admin', 'admin123')}>
              Admin
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => quickFill('staff', 'staff123')}>
              Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

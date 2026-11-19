import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { login } from '../api/auth.api';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const { login: saveSession } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSending(true);
    try {
      const response = await login({ email, password });
      saveSession(response.token, response.user);
      navigate('/tickets');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="card narrow">
      <h1>Ingresar</h1>
      <p className="muted">Accedé con tu email y contraseña.</p>

      {error && <p className="alert error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button type="submit" disabled={sending}>
          {sending ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="muted">
        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
      </p>

      <details className="demo">
        <summary>Usuarios de prueba</summary>
        <ul>
          <li>admin@tp.com / Admin123</li>
          <li>operador@tp.com / Operador123</li>
          <li>usuario@tp.com / Usuario123</li>
        </ul>
      </details>
    </section>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { request } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { UserSession } from '../types';

interface LoginResponse {
  token: string;
  user: UserSession;
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(res.token, res.user);
      navigate('/tickets');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al autenticar');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: '2rem auto' }}>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Email: </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <label>Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit" style={{ marginTop: '1rem' }}>Entrar</button>
    </form>
  );
};
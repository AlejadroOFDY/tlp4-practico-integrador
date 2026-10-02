import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { request } from '../api/client';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      navigate('/login');
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Error en registro');
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: '300px', margin: '2rem auto' }}>
      <h2>Registro</h2>
      {msg && <p style={{ color: 'red' }}>{msg}</p>}
      <div>
        <label>Email: </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <label>Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit" style={{ marginTop: '1rem' }}>Registrarme</button>
    </form>
  );
};
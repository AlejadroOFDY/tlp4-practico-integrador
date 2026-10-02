import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { NotificationBell } from './NotificationBell';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      {user ? (
        <>
          <Link to="/tickets">Tickets</Link>
          <NotificationBell />
          <span>{user.email} (<strong>{user.role}</strong>)</span>
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </>
      )}
    </nav>
  );
};
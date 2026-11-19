import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Can } from './Can';
import { NotificationBell } from './NotificationBell';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to={user ? '/tickets' : '/login'} className="brand">
        Mesa de Ayuda
      </Link>

      {user ? (
        <nav className="navbar-links">
          <NavLink to="/tickets">Tickets</NavLink>
          <NotificationBell />
          <Can permission="user:read">
            <NavLink to="/admin/users">Usuarios</NavLink>
          </Can>
          <span className="navbar-user">
            {user.name} · <strong>{user.role}</strong>
          </span>
          <button type="button" className="secondary" onClick={handleLogout}>
            Salir
          </button>
        </nav>
      ) : (
        <nav className="navbar-links">
          <NavLink to="/login">Ingresar</NavLink>
          <NavLink to="/register">Registrarse</NavLink>
        </nav>
      )}
    </header>
  );
}

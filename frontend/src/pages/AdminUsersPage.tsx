import { useEffect, useState } from 'react';
import { getErrorMessage } from '../api/client';
import { assignRole, listUsers } from '../api/users.api';
import { useAuth } from '../context/AuthContext';
import type { UserSummary } from '../types';

const ROLES = ['admin', 'operador', 'usuario'];

export function AdminUsersPage() {
  const { hasPermission, user: sessionUser } = useAuth();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [draftRoles, setDraftRoles] = useState<Record<number, string>>({});
  const canRead = hasPermission('user:read');
  const [loading, setLoading] = useState(canRead);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!canRead) {
      return;
    }

    let active = true;

    listUsers()
      .then((data) => {
        if (active) {
          setUsers(data);
          setDraftRoles(Object.fromEntries(data.map((item) => [item.id, item.role])));
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(getErrorMessage(err));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [canRead]);

  const handleAssign = async (userId: number) => {
    const role = draftRoles[userId];
    if (!role) {
      return;
    }
    setError(null);
    setNotice(null);
    try {
      const updated = await assignRole(userId, role);
      setUsers((current) => current.map((item) => (item.id === userId ? updated : item)));
      setNotice(`Rol de ${updated.email} actualizado a ${updated.role}.`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (!canRead) {
    return (
      <section className="card">
        <p className="alert error">No tenés permiso para administrar usuarios.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h1>Usuarios</h1>
      <p className="muted">Asigná un rol a cada usuario. Los cambios se aplican en el backend.</p>

      {error && <p className="alert error">{error}</p>}
      {notice && <p className="alert success">{notice}</p>}

      {loading ? (
        <p className="muted">Cargando usuarios…</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>
                  <select
                    value={draftRoles[item.id] ?? item.role}
                    disabled={!hasPermission('user:assign-role') || item.id === sessionUser?.id}
                    onChange={(event) =>
                      setDraftRoles((current) => ({ ...current, [item.id]: event.target.value }))
                    }
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    disabled={
                      !hasPermission('user:assign-role') ||
                      item.id === sessionUser?.id ||
                      (draftRoles[item.id] ?? item.role) === item.role
                    }
                    onClick={() => handleAssign(item.id)}
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

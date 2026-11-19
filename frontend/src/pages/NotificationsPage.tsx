import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getErrorMessage } from '../api/client';
import { listNotifications, markAllAsRead, markAsRead } from '../api/notifications.api';
import type { NotificationItem } from '../types';
import { formatDate } from '../utils/format';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listNotifications()
      .then((data) => {
        if (active) {
          setNotifications(data);
          setError(null);
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
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications((current) =>
        current.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const unread = notifications.filter((item) => !item.isRead).length;

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h1>Notificaciones</h1>
          <p className="muted">{unread} sin leer de {notifications.length}.</p>
        </div>
        {unread > 0 && (
          <button type="button" className="secondary" onClick={handleMarkAll}>
            Marcar todas como leídas
          </button>
        )}
      </div>

      {error && <p className="alert error">{error}</p>}

      {loading ? (
        <p className="muted">Cargando notificaciones…</p>
      ) : notifications.length === 0 ? (
        <p className="muted">
          No tenés notificaciones. Suscribite a un ticket para recibir avisos cuando cambie de
          estado.
        </p>
      ) : (
        <ul className="notification-list">
          {notifications.map((item) => (
            <li key={item.id} className={item.isRead ? 'read' : 'unread'}>
              <div>
                <p>{item.message}</p>
                <p className="muted small">
                  {formatDate(item.createdAt)} ·{' '}
                  <Link to={`/tickets/${item.ticketId}`}>Ver ticket #{item.ticketId}</Link>
                </p>
              </div>
              {!item.isRead && (
                <button type="button" className="secondary" onClick={() => handleMarkAsRead(item.id)}>
                  Marcar como leída
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

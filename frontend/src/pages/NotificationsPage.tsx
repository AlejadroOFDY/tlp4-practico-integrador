import React, { useEffect, useState } from 'react';
import { request } from '../api/client';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const loadNotifications = async () => {
    const data = await request<NotificationItem[]>('/notifications');
    setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    await request(`/notifications/${id}/read`, { method: 'PATCH' });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Bandeja de Notificaciones</h2>
      {notifications.length === 0 && <p>No tienes notificaciones.</p>}
      <ul>
        {notifications.map((n) => (
          <li key={n.id} style={{ marginBottom: '0.5rem', opacity: n.read ? 0.5 : 1 }}>
            <span>{n.message} </span>
            {!n.read && (
              <button onClick={() => markAsRead(n.id)}>Marcar como leída</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
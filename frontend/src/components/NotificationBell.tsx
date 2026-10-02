import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { request } from '../api/client';
import { NotificationItem } from '../types';

export const NotificationBell: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnread = async () => {
    try {
      const data = await request<NotificationItem[]>('/notifications');
      setUnreadCount(data.filter((item) => !item.read).length);
    } catch {
      // Ignorar fallas si el backend aún no está activo
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link to="/notifications" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
      🔔 ({unreadCount})
    </Link>
  );
};
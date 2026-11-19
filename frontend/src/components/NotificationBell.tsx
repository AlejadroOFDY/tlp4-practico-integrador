import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getUnreadCount } from '../api/notifications.api';

const POLL_INTERVAL_MS = 8000;

export function NotificationBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { count } = await getUnreadCount();
        if (active) {
          setUnread(count);
        }
      } catch {
        // Si el backend no responde se mantiene el último valor.
      }
    };

    void load();
    const interval = setInterval(() => void load(), POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Link to="/notifications" className="bell">
      Notificaciones
      {unread > 0 && <span className="badge-count">{unread}</span>}
    </Link>
  );
}

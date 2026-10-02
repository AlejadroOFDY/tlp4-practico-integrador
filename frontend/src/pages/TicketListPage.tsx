import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { request } from '../api/client';
import { TicketItem } from '../types';

export const TicketListPage: React.FC = () => {
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  useEffect(() => {
    request<TicketItem[]>('/tickets')
      .then(setTickets)
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Listado de Tickets</h2>
      <ul>
        {tickets.map((t) => (
          <li key={t.id} style={{ margin: '0.5rem 0' }}>
            <Link to={`/tickets/${t.id}`}>
              <strong>{t.title}</strong> - Estado: {t.status}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { request } from '../api/client';
import { TicketItem, TicketStatus } from '../types';
import { Can } from '../components/Can';

export const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketItem | null>(null);

  const loadTicket = async () => {
    try {
      const data = await request<TicketItem>(`/tickets/${id}`);
      setTicket(data);
    } catch {
      // Manejar error de carga
    }
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const toggleSubscription = async () => {
    if (!ticket) return;
    const action = ticket.isSubscribed ? 'unsubscribe' : 'subscribe';
    const method = ticket.isSubscribed ? 'DELETE' : 'POST';
    await request(`/tickets/${id}/${action}`, { method });
    setTicket({ ...ticket, isSubscribed: !ticket.isSubscribed });
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    await request(`/tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
    loadTicket();
  };

  if (!ticket) return <p>Cargando ticket...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{ticket.title}</h2>
      <p>{ticket.description}</p>
      <p>Estado: <strong>{ticket.status}</strong></p>

      {/* RF4: Suscribirse / Desuscribirse */}
      <Can permission="subscription:create">
        <button onClick={toggleSubscription}>
          {ticket.isSubscribed ? 'Desuscribirse' : 'Suscribirse'}
        </button>
      </Can>

      {/* RF3: Cambio de estado (disponible según rol) */}
      <Can permission="ticket:change-status">
        <div style={{ marginTop: '1rem' }}>
          <label>Actualizar estado: </label>
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
          >
            <option value="ABIERTO">ABIERTO</option>
            <option value="EN_PROGRESO">EN_PROGRESO</option>
            <option value="RESUELTO">RESUELTO</option>
            <option value="CERRADO">CERRADO</option>
          </select>
        </div>
      </Can>
    </div>
  );
};
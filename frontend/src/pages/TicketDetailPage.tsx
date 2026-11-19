import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { getErrorMessage } from '../api/client';
import {
  changeTicketStatus,
  deleteTicket,
  getTicket,
  isSubscribed,
  subscribeToTicket,
  unsubscribeFromTicket,
} from '../api/tickets.api';
import { Can } from '../components/Can';
import type { Ticket, TicketStatus } from '../types';
import { formatDate, statusLabel, TICKET_STATUSES } from '../utils/format';

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ticketId = Number(id);
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([getTicket(ticketId), isSubscribed(ticketId)])
      .then(([ticketData, subscriptionData]) => {
        if (active) {
          setTicket(ticketData);
          setSubscribed(subscriptionData.subscribed);
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
  }, [ticketId]);

  const handleSubscriptionToggle = async () => {
    setBusy(true);
    setNotice(null);
    try {
      if (subscribed) {
        await unsubscribeFromTicket(ticketId);
        setSubscribed(false);
        setNotice('Te desuscribiste del ticket.');
      } else {
        await subscribeToTicket(ticketId);
        setSubscribed(true);
        setNotice('Suscripción registrada. Vas a recibir notificaciones de este ticket.');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleStatusChange = async (status: TicketStatus) => {
    setBusy(true);
    setError(null);
    try {
      const updated = await changeTicketStatus(ticketId, status);
      setTicket(updated);
      setNotice(`Estado actualizado a ${statusLabel(updated.status)}.`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este ticket?')) {
      return;
    }
    try {
      await deleteTicket(ticketId);
      navigate('/tickets');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return <p className="muted">Cargando ticket…</p>;
  }

  if (!ticket) {
    return (
      <section className="card">
        <p className="alert error">{error ?? 'Ticket no encontrado'}</p>
        <Link to="/tickets">Volver al listado</Link>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <Link to="/tickets" className="muted">
            ← Tickets
          </Link>
          <h1>{ticket.title}</h1>
          <p className="muted">
            Ticket #{ticket.id} · Creado {formatDate(ticket.createdAt)} · Actualizado{' '}
            {formatDate(ticket.updatedAt)}
          </p>
        </div>
        <span className={`status status-${ticket.status.toLowerCase()}`}>
          {statusLabel(ticket.status)}
        </span>
      </div>

      {error && <p className="alert error">{error}</p>}
      {notice && <p className="alert success">{notice}</p>}

      <p className="description">{ticket.description}</p>

      <div className="actions">
        <Can permission="subscription:create">
          <button type="button" onClick={handleSubscriptionToggle} disabled={busy}>
            {subscribed ? 'Desuscribirse' : 'Suscribirse'}
          </button>
        </Can>

        <Can permission="ticket:update">
          <Link to={`/tickets/${ticket.id}/edit`} className="button-link secondary">
            Editar
          </Link>
        </Can>

        <Can permission="ticket:delete">
          <button type="button" className="danger" onClick={handleDelete}>
            Eliminar
          </button>
        </Can>
      </div>

      <Can permission="ticket:change-status">
        <div className="status-form">
          <label>
            Cambiar estado
            <select
              value={ticket.status}
              disabled={busy}
              onChange={(event) => void handleStatusChange(event.target.value as TicketStatus)}
            >
              {TICKET_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </label>
          <p className="muted">
            Al cambiar el estado se notifica a todos los usuarios suscriptos.
          </p>
        </div>
      </Can>
    </section>
  );
}

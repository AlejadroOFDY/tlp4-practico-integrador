import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getErrorMessage } from '../api/client';
import { listTickets } from '../api/tickets.api';
import { Can } from '../components/Can';
import type { Ticket } from '../types';
import { formatDate, statusLabel } from '../utils/format';

export function TicketListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTickets()
      .then(setTickets)
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="card">
      <div className="page-header">
        <div>
          <h1>Tickets</h1>
          <p className="muted">Listado de tickets de la mesa de ayuda.</p>
        </div>
        <Can permission="ticket:create">
          <Link to="/tickets/new" className="button-link">
            Nuevo ticket
          </Link>
        </Can>
      </div>

      {error && <p className="alert error">{error}</p>}

      {loading ? (
        <p className="muted">Cargando tickets…</p>
      ) : tickets.length === 0 ? (
        <p className="muted">No hay tickets registrados todavía.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Estado</th>
              <th>Actualizado</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>
                  <span className={`status status-${ticket.status.toLowerCase()}`}>
                    {statusLabel(ticket.status)}
                  </span>
                </td>
                <td>{formatDate(ticket.updatedAt)}</td>
                <td>
                  <Link to={`/tickets/${ticket.id}`}>Ver</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

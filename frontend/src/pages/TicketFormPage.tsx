import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { getErrorMessage } from '../api/client';
import { createTicket, getTicket, updateTicket } from '../api/tickets.api';

export function TicketFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) {
      return;
    }
    getTicket(Number(id))
      .then((ticket) => {
        setTitle(ticket.title);
        setDescription(ticket.description);
      })
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        await updateTicket(Number(id), { title, description });
        navigate(`/tickets/${id}`);
      } else {
        const ticket = await createTicket({ title, description });
        navigate(`/tickets/${ticket.id}`);
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="muted">Cargando ticket…</p>;
  }

  return (
    <section className="card narrow">
      <Link to="/tickets" className="muted">
        ← Tickets
      </Link>
      <h1>{isEdit ? 'Editar ticket' : 'Nuevo ticket'}</h1>

      {error && <p className="alert error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <label>
          Título
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength={120}
          />
        </label>
        <label>
          Descripción
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={6}
          />
        </label>
        <div className="actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
          <Link to={isEdit ? `/tickets/${id}` : '/tickets'} className="button-link secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}

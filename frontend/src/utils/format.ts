import type { TicketStatus } from '../types';

const STATUS_LABELS: Record<TicketStatus, string> = {
  ABIERTO: 'Abierto',
  EN_PROGRESO: 'En progreso',
  RESUELTO: 'Resuelto',
  CERRADO: 'Cerrado',
};

export const TICKET_STATUSES: TicketStatus[] = ['ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO'];

export function statusLabel(status: TicketStatus): string {
  return STATUS_LABELS[status];
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleString('es-PY', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

import { request } from './client';
import type { Ticket, TicketStatus } from '../types';

export interface TicketPayload {
  title: string;
  description: string;
}

export function listTickets(): Promise<Ticket[]> {
  return request<Ticket[]>('/tickets');
}

export function getTicket(id: number): Promise<Ticket> {
  return request<Ticket>(`/tickets/${id}`);
}

export function createTicket(payload: TicketPayload): Promise<Ticket> {
  return request<Ticket>('/tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTicket(id: number, payload: TicketPayload): Promise<Ticket> {
  return request<Ticket>(`/tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function changeTicketStatus(id: number, status: TicketStatus): Promise<Ticket> {
  return request<Ticket>(`/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function deleteTicket(id: number): Promise<void> {
  return request<void>(`/tickets/${id}`, { method: 'DELETE' });
}

export function isSubscribed(id: number): Promise<{ subscribed: boolean }> {
  return request<{ subscribed: boolean }>(`/tickets/${id}/subscribe`);
}

export function subscribeToTicket(id: number): Promise<{ subscribed: boolean }> {
  return request<{ subscribed: boolean }>(`/tickets/${id}/subscribe`, { method: 'POST' });
}

export function unsubscribeFromTicket(id: number): Promise<void> {
  return request<void>(`/tickets/${id}/subscribe`, { method: 'DELETE' });
}

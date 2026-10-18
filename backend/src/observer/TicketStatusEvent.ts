import type { TicketStatus } from '../models/enums.js';

export interface TicketStatusEvent {
  ticketId: number;
  title: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
}

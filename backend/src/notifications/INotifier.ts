import type { TicketStatus } from '../models/enums.js';

export interface NotificationData {
  userId: number;
  userEmail: string;
  ticketId: number;
  ticketTitle: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  message: string;
}

export interface INotifier {
  send(data: NotificationData): Promise<void>;
}

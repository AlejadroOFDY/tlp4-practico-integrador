export type TicketStatus = 'ABIERTO' | 'EN_PROGRESO' | 'RESUELTO' | 'CERRADO';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface AuthResponse {
  user: SessionUser;
  token: string;
}

export interface NotificationItem {
  id: number;
  userId: number;
  ticketId: number;
  message: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: string;
}

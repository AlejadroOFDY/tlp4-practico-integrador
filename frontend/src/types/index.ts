export interface UserSession {
  id: number;
  email: string;
  role: string;
  permissions: string[];
}

export type TicketStatus = 'ABIERTO' | 'EN_PROGRESO' | 'RESUELTO' | 'CERRADO';

export interface TicketItem {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  isSubscribed?: boolean;
}

export interface NotificationItem {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  createdAt: string;
}
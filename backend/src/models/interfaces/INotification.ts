import type { Optional } from 'sequelize';
import type { TicketStatus } from '../enums.js';

export interface INotification {
  id: number;
  userId: number;
  ticketId: number;
  message: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationCreationAttributes = Optional<
  INotification,
  'id' | 'isRead' | 'createdAt' | 'updatedAt'
>;

import type { Optional } from 'sequelize';
import type { TicketStatus } from '../enums.js';

export interface ITicket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type TicketCreationAttributes = Optional<ITicket, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

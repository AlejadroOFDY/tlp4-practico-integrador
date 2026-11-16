import type { Ticket } from '../../models/Ticket.js';
import type { TicketCreationAttributes } from '../../models/interfaces/ITicket.js';

export interface ITicketRepository {
  create(data: TicketCreationAttributes): Promise<Ticket>;
  findAll(): Promise<Ticket[]>;
  findById(id: number): Promise<Ticket | null>;
  update(id: number, data: Partial<TicketCreationAttributes>): Promise<Ticket | null>;
  delete(id: number): Promise<boolean>;
}

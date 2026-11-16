import { Ticket } from '../models/Ticket.js';
import type { TicketCreationAttributes } from '../models/interfaces/ITicket.js';
import type { ITicketRepository } from './interfaces/ITicketRepository.js';

export class TicketRepository implements ITicketRepository {
  async create(data: TicketCreationAttributes): Promise<Ticket> {
    return Ticket.create(data);
  }

  async findAll(): Promise<Ticket[]> {
    return Ticket.findAll();
  }

  async findById(id: number): Promise<Ticket | null> {
    return Ticket.findByPk(id);
  }

  async update(id: number, data: Partial<TicketCreationAttributes>): Promise<Ticket | null> {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return null;
    }
    await ticket.update(data);
    return ticket;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await Ticket.destroy({ where: { id } });
    return deleted > 0;
  }
}

import { CustomError } from '../errors/CustomError.js';
import { TicketStatus } from '../models/enums.js';
import type { Ticket } from '../models/Ticket.js';
import type { ISubject } from '../observer/ISubject.js';
import type { ITicketRepository } from '../repositories/interfaces/ITicketRepository.js';

export interface CreateTicketData {
  title: string;
  description: string;
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
}

export class TicketService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly eventPublisher: ISubject,
  ) {}

  async findAll(): Promise<Ticket[]> {
    return this.ticketRepository.findAll();
  }

  async findById(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw CustomError.NotFound('Ticket no encontrado');
    }
    return ticket;
  }

  async create(data: CreateTicketData): Promise<Ticket> {
    return this.ticketRepository.create({
      title: data.title,
      description: data.description,
    });
  }

  async update(id: number, data: UpdateTicketData): Promise<Ticket> {
    const ticket = await this.ticketRepository.update(id, data);
    if (!ticket) {
      throw CustomError.NotFound('Ticket no encontrado');
    }
    return ticket;
  }

  async changeStatus(id: number, newStatus: string): Promise<Ticket> {
    const statuses: string[] = Object.values(TicketStatus);
    if (!statuses.includes(newStatus)) {
      throw CustomError.BadRequest('Estado inválido');
    }

    const ticket = await this.findById(id);
    const previousStatus = ticket.status;

    if (previousStatus === newStatus) {
      return ticket;
    }

    const updatedTicket = await this.ticketRepository.update(id, {
      status: newStatus as TicketStatus,
    });
    if (!updatedTicket) {
      throw CustomError.NotFound('Ticket no encontrado');
    }

    await this.eventPublisher.notify({
      ticketId: updatedTicket.id,
      title: updatedTicket.title,
      previousStatus,
      newStatus: newStatus as TicketStatus,
    });

    return updatedTicket;
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.ticketRepository.delete(id);
    if (!deleted) {
      throw CustomError.NotFound('Ticket no encontrado');
    }
  }
}

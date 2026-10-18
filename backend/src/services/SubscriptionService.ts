import { CustomError } from '../errors/CustomError.js';
import type { ISubscriptionRepository } from '../repositories/interfaces/ISubscriptionRepository.js';
import type { ITicketRepository } from '../repositories/interfaces/ITicketRepository.js';

export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly ticketRepository: ITicketRepository,
  ) {}

  async subscribe(userId: number, ticketId: number): Promise<void> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw CustomError.NotFound('Ticket no encontrado');
    }

    const existingSubscription = await this.subscriptionRepository.findByUserAndTicket(
      userId,
      ticketId,
    );
    if (existingSubscription) {
      throw CustomError.BadRequest('Ya está suscrito a este ticket');
    }

    await this.subscriptionRepository.create(userId, ticketId);
  }

  async unsubscribe(userId: number, ticketId: number): Promise<void> {
    const deleted = await this.subscriptionRepository.delete(userId, ticketId);
    if (!deleted) {
      throw CustomError.NotFound('No está suscrito a este ticket');
    }
  }

  async isSubscribed(userId: number, ticketId: number): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findByUserAndTicket(userId, ticketId);
    return Boolean(subscription);
  }
}

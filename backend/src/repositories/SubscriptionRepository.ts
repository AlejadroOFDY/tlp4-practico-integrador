import { Subscription } from '../models/Subscription.js';
import type { ISubscriptionRepository } from './interfaces/ISubscriptionRepository.js';

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(userId: number, ticketId: number): Promise<Subscription> {
    return Subscription.create({ userId, ticketId });
  }

  async findByUserAndTicket(userId: number, ticketId: number): Promise<Subscription | null> {
    return Subscription.findOne({ where: { userId, ticketId } });
  }

  async findByTicketId(ticketId: number): Promise<Subscription[]> {
    return Subscription.findAll({ where: { ticketId } });
  }

  async findByUserId(userId: number): Promise<Subscription[]> {
    return Subscription.findAll({ where: { userId } });
  }

  async delete(userId: number, ticketId: number): Promise<boolean> {
    const deleted = await Subscription.destroy({ where: { userId, ticketId } });
    return deleted > 0;
  }
}

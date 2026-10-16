import type { Subscription } from '../../models/Subscription.js';

export interface ISubscriptionRepository {
  create(userId: number, ticketId: number): Promise<Subscription>;
  findByUserAndTicket(userId: number, ticketId: number): Promise<Subscription | null>;
  findByTicketId(ticketId: number): Promise<Subscription[]>;
  findByUserId(userId: number): Promise<Subscription[]>;
  delete(userId: number, ticketId: number): Promise<boolean>;
}

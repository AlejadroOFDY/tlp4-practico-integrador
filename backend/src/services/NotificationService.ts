import { CustomError } from '../errors/CustomError.js';
import type { Notification } from '../models/Notification.js';
import type { NotifierFactory } from '../notifications/NotifierFactory.js';
import type { NotificationData } from '../notifications/INotifier.js';
import type { IObserver } from '../observer/IObserver.js';
import type { TicketStatusEvent } from '../observer/TicketStatusEvent.js';
import type { INotificationRepository } from '../repositories/interfaces/INotificationRepository.js';
import type { ISubscriptionRepository } from '../repositories/interfaces/ISubscriptionRepository.js';
import type { IUserRepository } from '../repositories/interfaces/IUserRepository.js';

export class NotificationService implements IObserver {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly userRepository: IUserRepository,
    private readonly notifierFactory: NotifierFactory,
  ) {}

  async update(event: TicketStatusEvent): Promise<void> {
    const subscriptions = await this.subscriptionRepository.findByTicketId(event.ticketId);

    for (const subscription of subscriptions) {
      const user = await this.userRepository.findById(subscription.userId);
      if (!user) {
        continue;
      }

      const data: NotificationData = {
        userId: user.id,
        userEmail: user.email,
        ticketId: event.ticketId,
        ticketTitle: event.title,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        message: `El ticket #${event.ticketId} cambió de ${event.previousStatus} a ${event.newStatus}`,
      };

      await this.notifierFactory.create('inapp').send(data);
      await this.notifierFactory.create('console').send(data);
    }
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return this.notificationRepository.findByUserId(userId);
  }

  async countUnread(userId: number): Promise<number> {
    return this.notificationRepository.countUnreadByUserId(userId);
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    const updated = await this.notificationRepository.markAsRead(id, userId);
    if (!updated) {
      throw CustomError.NotFound('Notificación no encontrada');
    }
  }

  async markAllAsRead(userId: number): Promise<number> {
    return this.notificationRepository.markAllAsRead(userId);
  }
}

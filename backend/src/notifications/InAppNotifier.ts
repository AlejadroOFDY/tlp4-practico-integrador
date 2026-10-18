import type { INotificationRepository } from '../repositories/interfaces/INotificationRepository.js';
import type { INotifier, NotificationData } from './INotifier.js';

export class InAppNotifier implements INotifier {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  async send(data: NotificationData): Promise<void> {
    await this.notificationRepository.create({
      userId: data.userId,
      ticketId: data.ticketId,
      message: data.message,
      previousStatus: data.previousStatus,
      newStatus: data.newStatus,
    });
  }
}

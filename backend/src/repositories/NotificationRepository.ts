import { Notification } from '../models/Notification.js';
import type { NotificationCreationAttributes } from '../models/interfaces/INotification.js';
import type { INotificationRepository } from './interfaces/INotificationRepository.js';

export class NotificationRepository implements INotificationRepository {
  async create(data: NotificationCreationAttributes): Promise<Notification> {
    return Notification.create(data);
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    return Notification.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
  }

  async countUnreadByUserId(userId: number): Promise<number> {
    return Notification.count({ where: { userId, isRead: false } });
  }

  async markAsRead(id: number, userId: number): Promise<boolean> {
    const [affected] = await Notification.update({ isRead: true }, { where: { id, userId } });
    return affected > 0;
  }

  async markAllAsRead(userId: number): Promise<number> {
    const [affected] = await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } },
    );
    return affected;
  }
}

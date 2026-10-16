import type { Notification } from '../../models/Notification.js';
import type { NotificationCreationAttributes } from '../../models/interfaces/INotification.js';

export interface INotificationRepository {
  create(data: NotificationCreationAttributes): Promise<Notification>;
  findByUserId(userId: number): Promise<Notification[]>;
  countUnreadByUserId(userId: number): Promise<number>;
  markAsRead(id: number, userId: number): Promise<boolean>;
  markAllAsRead(userId: number): Promise<number>;
}

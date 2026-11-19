import { request } from './client';
import type { NotificationItem } from '../types';

export function listNotifications(): Promise<NotificationItem[]> {
  return request<NotificationItem[]>('/notifications');
}

export function getUnreadCount(): Promise<{ count: number }> {
  return request<{ count: number }>('/notifications/unread-count');
}

export function markAsRead(id: number): Promise<void> {
  return request<void>(`/notifications/${id}/read`, { method: 'PATCH' });
}

export function markAllAsRead(): Promise<{ updated: number }> {
  return request<{ updated: number }>('/notifications/read-all', { method: 'PATCH' });
}

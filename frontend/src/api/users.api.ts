import { request } from './client';
import type { UserSummary } from '../types';

export function listUsers(): Promise<UserSummary[]> {
  return request<UserSummary[]>('/users');
}

export function assignRole(userId: number, role: string): Promise<UserSummary> {
  return request<UserSummary>(`/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

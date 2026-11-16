import type { Optional } from 'sequelize';

export interface ISubscription {
  id: number;
  userId: number;
  ticketId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionCreationAttributes = Optional<ISubscription, 'id' | 'createdAt' | 'updatedAt'>;

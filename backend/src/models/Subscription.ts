import { DataTypes, Model } from 'sequelize';
import { DatabaseConnection } from '../db/DatabaseConnection.js';
import type { ISubscription, SubscriptionCreationAttributes } from './interfaces/ISubscription.js';

export class Subscription extends Model<ISubscription, SubscriptionCreationAttributes> implements ISubscription {
  declare id: number;
  declare userId: number;
  declare ticketId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: DatabaseConnection.getInstance().getSequelize(),
    tableName: 'subscriptions',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'ticketId'],
      },
    ],
  },
);

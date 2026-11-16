import { DataTypes, Model } from 'sequelize';
import { DatabaseConnection } from '../db/DatabaseConnection.js';
import { TicketStatus } from './enums.js';
import type { INotification, NotificationCreationAttributes } from './interfaces/INotification.js';

export class Notification extends Model<INotification, NotificationCreationAttributes> implements INotification {
  declare id: number;
  declare userId: number;
  declare ticketId: number;
  declare message: string;
  declare previousStatus: TicketStatus;
  declare newStatus: TicketStatus;
  declare isRead: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Notification.init(
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
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    previousStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    newStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'notifications',
  },
);

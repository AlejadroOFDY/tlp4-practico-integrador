import { DataTypes, Model } from 'sequelize';
import { DatabaseConnection } from '../db/DatabaseConnection.js';
import { TicketStatus } from './enums.js';
import type { ITicket, TicketCreationAttributes } from './interfaces/ITicket.js';

export class Ticket extends Model<ITicket, TicketCreationAttributes> implements ITicket {
  declare id: number;
  declare title: string;
  declare description: string;
  declare status: TicketStatus;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        TicketStatus.ABIERTO,
        TicketStatus.EN_PROGRESO,
        TicketStatus.RESUELTO,
        TicketStatus.CERRADO,
      ),
      allowNull: false,
      defaultValue: TicketStatus.ABIERTO,
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
    tableName: 'tickets',
  },
);

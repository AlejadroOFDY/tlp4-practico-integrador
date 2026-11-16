import { DataTypes, Model } from 'sequelize';
import { DatabaseConnection } from '../db/DatabaseConnection.js';
import type { IPermission, PermissionCreationAttributes } from './interfaces/IPermission.js';

export class Permission extends Model<IPermission, PermissionCreationAttributes> implements IPermission {
  declare id: number;
  declare action: string;
  declare description: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'permissions',
  },
);

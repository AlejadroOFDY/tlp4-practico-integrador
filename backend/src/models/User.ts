import { DataTypes, Model } from 'sequelize';
import { DatabaseConnection } from '../db/DatabaseConnection.js';
import type { IUser, UserCreationAttributes } from './interfaces/IUser.js';

export class User extends Model<IUser, UserCreationAttributes> implements IUser {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare roleId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
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
    tableName: 'users',
  },
);

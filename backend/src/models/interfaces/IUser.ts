import type { Optional } from 'sequelize';

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserCreationAttributes = Optional<IUser, 'id' | 'createdAt' | 'updatedAt'>;

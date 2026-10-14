import type { Optional } from 'sequelize';

export interface IRole {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RoleCreationAttributes = Optional<IRole, 'id' | 'createdAt' | 'updatedAt'>;

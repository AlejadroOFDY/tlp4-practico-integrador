import type { Optional } from 'sequelize';

export interface IPermission {
  id: number;
  action: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PermissionCreationAttributes = Optional<
  IPermission,
  'id' | 'description' | 'createdAt' | 'updatedAt'
>;

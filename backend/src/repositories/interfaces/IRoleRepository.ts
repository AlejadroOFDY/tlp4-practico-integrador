import type { Role } from '../../models/Role.js';
import type { RoleCreationAttributes } from '../../models/interfaces/IRole.js';

export interface IRoleRepository {
  findAll(): Promise<Role[]>;
  findByName(name: string): Promise<Role | null>;
  findByNameWithPermissions(name: string): Promise<Role | null>;
  create(data: RoleCreationAttributes): Promise<Role>;
  createWithPermissions(name: string, actions: string[]): Promise<Role>;
}

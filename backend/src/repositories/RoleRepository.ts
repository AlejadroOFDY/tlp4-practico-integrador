import { Permission } from '../models/Permission.js';
import { Role } from '../models/Role.js';
import type { RoleCreationAttributes } from '../models/interfaces/IRole.js';
import type { IRoleRepository } from './interfaces/IRoleRepository.js';

export class RoleRepository implements IRoleRepository {
  async findAll(): Promise<Role[]> {
    return Role.findAll();
  }

  async findByName(name: string): Promise<Role | null> {
    return Role.findOne({ where: { name } });
  }

  async findByNameWithPermissions(name: string): Promise<Role | null> {
    return Role.findOne({
      where: { name },
      include: [{ model: Permission, as: 'permissions' }],
    });
  }

  async create(data: RoleCreationAttributes): Promise<Role> {
    return Role.create(data);
  }

  async createWithPermissions(name: string, actions: string[]): Promise<Role> {
    const role = await Role.create({ name });
    const permissions = await Promise.all(
      actions.map((action) => Permission.findOrCreate({ where: { action }, defaults: { action } })),
    );
    await role.setPermissions(permissions.map(([permission]) => permission));
    return role;
  }
}

import { BcryptAdapter } from '../helpers/BcryptAdapter.js';
import { RoleName } from '../models/enums.js';
import type { IRoleRepository } from '../repositories/interfaces/IRoleRepository.js';
import type { IUserRepository } from '../repositories/interfaces/IUserRepository.js';

const adminPermissions = [
  'ticket:read',
  'ticket:create',
  'ticket:update',
  'ticket:change-status',
  'ticket:delete',
  'subscription:create',
  'subscription:delete',
  'notification:read',
  'user:read',
  'user:assign-role',
];

const operadorPermissions = [
  'ticket:read',
  'ticket:create',
  'ticket:update',
  'ticket:change-status',
  'subscription:create',
  'subscription:delete',
  'notification:read',
];

const usuarioPermissions = [
  'ticket:read',
  'subscription:create',
  'subscription:delete',
  'notification:read',
];

interface SeedRole {
  name: RoleName;
  permissions: string[];
}

interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: RoleName;
}

const roles: SeedRole[] = [
  { name: RoleName.ADMIN, permissions: adminPermissions },
  { name: RoleName.OPERADOR, permissions: operadorPermissions },
  { name: RoleName.USUARIO, permissions: usuarioPermissions },
];

const users: SeedUser[] = [
  { name: 'Administrador', email: 'admin@tp.com', password: 'Admin123', role: RoleName.ADMIN },
  { name: 'Operador', email: 'operador@tp.com', password: 'Operador123', role: RoleName.OPERADOR },
  { name: 'Usuario', email: 'usuario@tp.com', password: 'Usuario123', role: RoleName.USUARIO },
];

export async function seed(
  userRepository: IUserRepository,
  roleRepository: IRoleRepository,
): Promise<void> {
  for (const role of roles) {
    const existingRole = await roleRepository.findByName(role.name);
    if (!existingRole) {
      await roleRepository.createWithPermissions(role.name, role.permissions);
    }
  }

  for (const user of users) {
    const existingUser = await userRepository.findByEmail(user.email);
    if (existingUser) {
      continue;
    }

    const role = await roleRepository.findByName(user.role);
    if (!role) {
      continue;
    }

    const hashedPassword = await BcryptAdapter.hash(user.password);
    await userRepository.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      roleId: role.id,
    });
  }

  console.log('[SEED] Roles y usuarios de prueba verificados');
}

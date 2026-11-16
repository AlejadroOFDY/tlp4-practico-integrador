import { Permission } from '../models/Permission.js';
import { Role } from '../models/Role.js';
import { User } from '../models/User.js';
import type { UserCreationAttributes } from '../models/interfaces/IUser.js';
import type { IUserRepository } from './interfaces/IUserRepository.js';

export class UserRepository implements IUserRepository {
  async create(data: UserCreationAttributes): Promise<User> {
    return User.create(data);
  }

  async findAll(): Promise<User[]> {
    return User.findAll();
  }

  async findById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async findWithRoleAndPermissions(id: number): Promise<User | null> {
    return User.findByPk(id, {
      include: [
        {
          model: Role,
          as: 'role',
          include: [{ model: Permission, as: 'permissions' }],
        },
      ],
    });
  }

  async updateRole(id: number, roleId: number): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    user.roleId = roleId;
    await user.save();
    return user;
  }
}

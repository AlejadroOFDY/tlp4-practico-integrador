import { CustomError } from '../errors/CustomError.js';
import type { User } from '../models/User.js';
import type { IRoleRepository } from '../repositories/interfaces/IRoleRepository.js';
import type { IUserRepository } from '../repositories/interfaces/IUserRepository.js';

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async assignRole(userId: number, roleName: string): Promise<User> {
    const role = await this.roleRepository.findByName(roleName);
    if (!role) {
      throw CustomError.NotFound('Rol no encontrado');
    }

    const user = await this.userRepository.updateRole(userId, role.id);
    if (!user) {
      throw CustomError.NotFound('Usuario no encontrado');
    }

    return user;
  }
}

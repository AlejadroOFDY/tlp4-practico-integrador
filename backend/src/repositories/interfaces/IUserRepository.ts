import type { User } from '../../models/User.js';
import type { UserCreationAttributes } from '../../models/interfaces/IUser.js';

export interface IUserRepository {
  create(data: UserCreationAttributes): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findWithRoleAndPermissions(id: number): Promise<User | null>;
  updateRole(id: number, roleId: number): Promise<User | null>;
}

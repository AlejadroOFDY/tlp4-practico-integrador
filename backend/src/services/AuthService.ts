import { CustomError } from '../errors/CustomError.js';
import { BcryptAdapter } from '../helpers/BcryptAdapter.js';
import { JwtAdapter } from '../helpers/JwtAdapter.js';
import { RoleName } from '../models/enums.js';
import type { User } from '../models/User.js';
import type { IRoleRepository } from '../repositories/interfaces/IRoleRepository.js';
import type { IUserRepository } from '../repositories/interfaces/IUserRepository.js';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roleId: number;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
  ) {}

  async register(data: RegisterData): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw CustomError.BadRequest('El email ya está registrado');
    }

    const usuarioRole = await this.roleRepository.findByName(RoleName.USUARIO);
    if (!usuarioRole) {
      throw CustomError.InternalServer('El rol usuario no está configurado');
    }

    const hashedPassword = await BcryptAdapter.hash(data.password);
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      roleId: usuarioRole.id,
    });

    return this.buildResponse(user);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw CustomError.Unauthorized('Credenciales inválidas');
    }

    const isValidPassword = await BcryptAdapter.compare(password, user.password);
    if (!isValidPassword) {
      throw CustomError.Unauthorized('Credenciales inválidas');
    }

    return this.buildResponse(user);
  }

  private async buildResponse(user: User): Promise<AuthResponse> {
    const token = await JwtAdapter.generateToken({ id: user.id });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      },
      token,
    };
  }
}

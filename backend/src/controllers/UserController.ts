import type { NextFunction, Request, Response } from 'express';
import type { User } from '../models/User.js';
import type { UserService } from '../services/UserService.js';

export class UserController {
  constructor(private readonly userService: UserService) {}

  private toResponse(user: User): { id: number; name: string; email: string; roleId: number } {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
    };
  }

  findAll = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.findAll();
      response.status(200).json(users.map((user) => this.toResponse(user)));
    } catch (error) {
      next(error);
    }
  };

  assignRole = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.assignRole(Number(request.params.id), request.body.role);
      response.status(200).json(this.toResponse(user));
    } catch (error) {
      next(error);
    }
  };
}

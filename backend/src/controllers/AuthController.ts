import type { NextFunction, Request, Response } from 'express';
import type { AuthService } from '../services/AuthService.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
      });
      response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(request.body.email, request.body.password);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

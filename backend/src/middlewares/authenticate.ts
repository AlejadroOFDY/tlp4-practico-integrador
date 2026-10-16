import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { CustomError } from '../errors/CustomError.js';
import { JwtAdapter } from '../helpers/JwtAdapter.js';
import type { IUserRepository } from '../repositories/interfaces/IUserRepository.js';

export function createAuthenticate(userRepository: IUserRepository): RequestHandler {
  return async (request: Request, _response: Response, next: NextFunction): Promise<void> => {
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      next(CustomError.Unauthorized('Token requerido'));
      return;
    }

    const token = authorization.slice('Bearer '.length);
    const payload = await JwtAdapter.verifyToken(token);
    if (!payload) {
      next(CustomError.Unauthorized('Token inválido'));
      return;
    }

    const user = await userRepository.findWithRoleAndPermissions(payload.id);
    if (!user) {
      next(CustomError.Unauthorized('Token inválido'));
      return;
    }

    request.user = user;
    next();
  };
}

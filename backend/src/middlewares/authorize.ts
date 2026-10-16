import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { CustomError } from '../errors/CustomError.js';

export function authorize(requiredPermission: string): RequestHandler {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const permissions = request.user?.role?.permissions ?? [];
    const hasPermission = permissions.some(
      (permission) => permission.action === requiredPermission,
    );

    if (!hasPermission) {
      next(CustomError.Forbidden('No tiene permiso para realizar esta acción'));
      return;
    }

    next();
  };
}

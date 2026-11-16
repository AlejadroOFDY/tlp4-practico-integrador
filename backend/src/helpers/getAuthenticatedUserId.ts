import type { Request } from 'express';
import { CustomError } from '../errors/CustomError.js';

export function getAuthenticatedUserId(request: Request): number {
  const userId = request.user?.id;
  if (!userId) {
    throw CustomError.Unauthorized('No autenticado');
  }
  return userId;
}

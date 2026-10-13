import type { ErrorRequestHandler } from 'express';
import { CustomError } from '../errors/CustomError.js';

export const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (error instanceof CustomError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }

  console.error('[ERROR]', error);
  const message = error instanceof Error ? error.message : 'Error interno del servidor';
  response.status(500).json({ message });
};

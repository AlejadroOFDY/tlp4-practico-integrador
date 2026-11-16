import type { NextFunction, Request, Response } from 'express';

export function validateRequiredFields(fields: string[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const body = request.body as Record<string, unknown>;
    const missing = fields.filter((field) => {
      const value = body[field];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      response.status(400).json({ error: `Faltan campos: ${missing.join(', ')}` });
      return;
    }

    next();
  };
}

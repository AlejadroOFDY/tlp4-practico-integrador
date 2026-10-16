import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface JwtPayload {
  id: number;
}

export class JwtAdapter {
  static async generateToken(payload: JwtPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, env.jwtSecret, { expiresIn: '2h' }, (error, token) => {
        if (error || !token) {
          reject(error ?? new Error('No se pudo generar el token'));
          return;
        }
        resolve(token);
      });
    });
  }

  static async verifyToken(token: string): Promise<JwtPayload | null> {
    return new Promise((resolve) => {
      jwt.verify(token, env.jwtSecret, (error, decoded) => {
        if (error || !decoded || typeof decoded === 'string') {
          resolve(null);
          return;
        }
        resolve(decoded as JwtPayload);
      });
    });
  }
}

import { Router } from 'express';
import type { AuthController } from '../controllers/AuthController.js';
import { validateRequiredFields } from '../middlewares/validate.js';

export class AuthRoutes {
  constructor(private readonly authController: AuthController) {}

  get routes(): Router {
    const router = Router();

    router.post(
      '/register',
      validateRequiredFields(['name', 'email', 'password']),
      this.authController.register,
    );
    router.post(
      '/login',
      validateRequiredFields(['email', 'password']),
      this.authController.login,
    );

    return router;
  }
}

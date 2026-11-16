import { Router, type RequestHandler } from 'express';
import type { UserController } from '../controllers/UserController.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequiredFields } from '../middlewares/validate.js';

export class UserRoutes {
  constructor(
    private readonly userController: UserController,
    private readonly authenticate: RequestHandler,
  ) {}

  get routes(): Router {
    const router = Router();

    router.get(
      '/',
      this.authenticate,
      authorize('user:read'),
      this.userController.findAll,
    );
    router.patch(
      '/:id/role',
      this.authenticate,
      authorize('user:assign-role'),
      validateRequiredFields(['role']),
      this.userController.assignRole,
    );

    return router;
  }
}

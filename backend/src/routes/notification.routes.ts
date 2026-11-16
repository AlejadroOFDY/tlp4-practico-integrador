import { Router, type RequestHandler } from 'express';
import type { NotificationController } from '../controllers/NotificationController.js';
import { authorize } from '../middlewares/authorize.js';

export class NotificationRoutes {
  constructor(
    private readonly notificationController: NotificationController,
    private readonly authenticate: RequestHandler,
  ) {}

  get routes(): Router {
    const router = Router();

    router.get(
      '/',
      this.authenticate,
      authorize('notification:read'),
      this.notificationController.findAll,
    );
    router.get(
      '/unread-count',
      this.authenticate,
      authorize('notification:read'),
      this.notificationController.countUnread,
    );
    router.patch(
      '/read-all',
      this.authenticate,
      authorize('notification:read'),
      this.notificationController.markAllAsRead,
    );
    router.patch(
      '/:id/read',
      this.authenticate,
      authorize('notification:read'),
      this.notificationController.markAsRead,
    );

    return router;
  }
}

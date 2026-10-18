import { Router, type RequestHandler } from 'express';
import type { SubscriptionController } from '../controllers/SubscriptionController.js';
import { authorize } from '../middlewares/authorize.js';

export class SubscriptionRoutes {
  constructor(
    private readonly subscriptionController: SubscriptionController,
    private readonly authenticate: RequestHandler,
  ) {}

  get routes(): Router {
    const router = Router();

    router.post(
      '/:id/subscribe',
      this.authenticate,
      authorize('subscription:create'),
      this.subscriptionController.subscribe,
    );
    router.delete(
      '/:id/subscribe',
      this.authenticate,
      authorize('subscription:delete'),
      this.subscriptionController.unsubscribe,
    );
    router.get(
      '/:id/subscribe',
      this.authenticate,
      authorize('subscription:create'),
      this.subscriptionController.isSubscribed,
    );

    return router;
  }
}

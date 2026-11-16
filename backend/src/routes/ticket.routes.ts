import { Router, type RequestHandler } from 'express';
import type { TicketController } from '../controllers/TicketController.js';
import { authorize } from '../middlewares/authorize.js';
import { validateRequiredFields } from '../middlewares/validate.js';

export class TicketRoutes {
  constructor(
    private readonly ticketController: TicketController,
    private readonly authenticate: RequestHandler,
  ) {}

  get routes(): Router {
    const router = Router();

    router.get('/', this.authenticate, authorize('ticket:read'), this.ticketController.findAll);
    router.get('/:id', this.authenticate, authorize('ticket:read'), this.ticketController.findById);
    router.post(
      '/',
      this.authenticate,
      authorize('ticket:create'),
      validateRequiredFields(['title', 'description']),
      this.ticketController.create,
    );
    router.put(
      '/:id',
      this.authenticate,
      authorize('ticket:update'),
      this.ticketController.update,
    );
    router.patch(
      '/:id/status',
      this.authenticate,
      authorize('ticket:change-status'),
      validateRequiredFields(['status']),
      this.ticketController.changeStatus,
    );
    router.delete(
      '/:id',
      this.authenticate,
      authorize('ticket:delete'),
      this.ticketController.remove,
    );

    return router;
  }
}

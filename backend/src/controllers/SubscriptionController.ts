import type { NextFunction, Request, Response } from 'express';
import { getAuthenticatedUserId } from '../helpers/getAuthenticatedUserId.js';
import type { SubscriptionService } from '../services/SubscriptionService.js';

export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  subscribe = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getAuthenticatedUserId(request);
      await this.subscriptionService.subscribe(userId, Number(request.params.id));
      response.status(201).json({ subscribed: true });
    } catch (error) {
      next(error);
    }
  };

  unsubscribe = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getAuthenticatedUserId(request);
      await this.subscriptionService.unsubscribe(userId, Number(request.params.id));
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  isSubscribed = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getAuthenticatedUserId(request);
      const subscribed = await this.subscriptionService.isSubscribed(
        userId,
        Number(request.params.id),
      );
      response.status(200).json({ subscribed });
    } catch (error) {
      next(error);
    }
  };
}

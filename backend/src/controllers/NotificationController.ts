import type { NextFunction, Request, Response } from 'express';
import { getAuthenticatedUserId } from '../helpers/getAuthenticatedUserId.js';
import type { NotificationService } from '../services/NotificationService.js';

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  findAll = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getAuthenticatedUserId(request);
      const notifications = await this.notificationService.findByUser(userId);
      response.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  };

  countUnread = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getAuthenticatedUserId(request);
      const count = await this.notificationService.countUnread(userId);
      response.status(200).json({ count });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getAuthenticatedUserId(request);
      await this.notificationService.markAsRead(Number(request.params.id), userId);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = getAuthenticatedUserId(request);
      const updated = await this.notificationService.markAllAsRead(userId);
      response.status(200).json({ updated });
    } catch (error) {
      next(error);
    }
  };
}

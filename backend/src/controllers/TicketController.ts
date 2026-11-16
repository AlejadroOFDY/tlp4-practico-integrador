import type { NextFunction, Request, Response } from 'express';
import type { TicketService, UpdateTicketData } from '../services/TicketService.js';

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  findAll = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const tickets = await this.ticketService.findAll();
      response.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  };

  findById = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const ticket = await this.ticketService.findById(Number(request.params.id));
      response.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const ticket = await this.ticketService.create({
        title: request.body.title,
        description: request.body.description,
      });
      response.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const data: UpdateTicketData = {};
      if (request.body.title !== undefined) {
        data.title = request.body.title;
      }
      if (request.body.description !== undefined) {
        data.description = request.body.description;
      }

      const ticket = await this.ticketService.update(Number(request.params.id), data);
      response.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  };

  changeStatus = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const ticket = await this.ticketService.changeStatus(
        Number(request.params.id),
        request.body.status,
      );
      response.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  };

  remove = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      await this.ticketService.remove(Number(request.params.id));
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}

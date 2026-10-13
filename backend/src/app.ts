import cors from 'cors';
import express, { type Express } from 'express';
import { errorHandler } from './middlewares/errorHandler.js';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (request, response) => {
    response.json({ status: 'ok' });
  });

  app.use(errorHandler);

  return app;
}

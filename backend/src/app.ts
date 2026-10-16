import cors from 'cors';
import express, { type Express, type Router } from 'express';
import { errorHandler } from './middlewares/errorHandler.js';

export interface AppRouter {
  basePath: string;
  router: Router;
}

export function createApp(routers: AppRouter[]): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (request, response) => {
    response.json({ status: 'ok' });
  });

  for (const { basePath, router } of routers) {
    app.use(`/api${basePath}`, router);
  }

  app.use(errorHandler);

  return app;
}

import { createApp } from './app.js';
import { env } from './config/env.js';
import { DatabaseConnection } from './db/DatabaseConnection.js';

async function bootstrap(): Promise<void> {
  const db = DatabaseConnection.getInstance();
  await db.connect();
  console.log('[DB] Conexión establecida con PostgreSQL');

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[API] Escuchando en http://localhost:${env.port}/api`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error('[API] Error al iniciar:', error);
  process.exit(1);
});

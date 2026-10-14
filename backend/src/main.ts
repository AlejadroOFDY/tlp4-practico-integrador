import { createApp } from './app.js';
import { env } from './config/env.js';
import { DatabaseConnection } from './db/DatabaseConnection.js';
import './models/associations.js';

async function bootstrap(): Promise<void> {
  const database = DatabaseConnection.getInstance();
  await database.connect();
  console.log('[DB] Conexión establecida con PostgreSQL');

  await database.getSequelize().sync();
  console.log('[DB] Modelos sincronizados');

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[API] Escuchando en http://localhost:${env.port}/api`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error('[API] Error al iniciar:', error);
  process.exit(1);
});

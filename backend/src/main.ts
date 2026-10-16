import { createApp } from './app.js';
import { env } from './config/env.js';
import { DatabaseConnection } from './db/DatabaseConnection.js';
import { seed } from './db/seed.js';
import './models/associations.js';
import { AuthController } from './controllers/AuthController.js';
import { UserController } from './controllers/UserController.js';
import { createAuthenticate } from './middlewares/authenticate.js';
import { RoleRepository } from './repositories/RoleRepository.js';
import { UserRepository } from './repositories/UserRepository.js';
import { AuthRoutes } from './routes/auth.routes.js';
import { UserRoutes } from './routes/user.routes.js';
import { AuthService } from './services/AuthService.js';
import { UserService } from './services/UserService.js';

async function bootstrap(): Promise<void> {
  const database = DatabaseConnection.getInstance();
  await database.connect();
  console.log('[DB] Conexión establecida con PostgreSQL');

  await database.getSequelize().sync();
  console.log('[DB] Modelos sincronizados');

  const userRepository = new UserRepository();
  const roleRepository = new RoleRepository();

  await seed(userRepository, roleRepository);

  const authService = new AuthService(userRepository, roleRepository);
  const userService = new UserService(userRepository, roleRepository);

  const authController = new AuthController(authService);
  const userController = new UserController(userService);

  const authenticate = createAuthenticate(userRepository);

  const routers = [
    { basePath: '/auth', router: new AuthRoutes(authController).routes },
    { basePath: '/users', router: new UserRoutes(userController, authenticate).routes },
  ];

  const app = createApp(routers);
  app.listen(env.port, () => {
    console.log(`[API] Escuchando en http://localhost:${env.port}/api`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error('[API] Error al iniciar:', error);
  process.exit(1);
});

import { createApp } from './app.js';
import { env } from './config/env.js';
import { AuthController } from './controllers/AuthController.js';
import { NotificationController } from './controllers/NotificationController.js';
import { SubscriptionController } from './controllers/SubscriptionController.js';
import { TicketController } from './controllers/TicketController.js';
import { UserController } from './controllers/UserController.js';
import { DatabaseConnection } from './db/DatabaseConnection.js';
import { seed } from './db/seed.js';
import { createAuthenticate } from './middlewares/authenticate.js';
import './models/associations.js';
import { ConsoleNotifierAdapter } from './notifications/ConsoleNotifierAdapter.js';
import { InAppNotifier } from './notifications/InAppNotifier.js';
import { NotifierFactory } from './notifications/NotifierFactory.js';
import { EventPublisher } from './observer/EventPublisher.js';
import { NotificationRepository } from './repositories/NotificationRepository.js';
import { RoleRepository } from './repositories/RoleRepository.js';
import { SubscriptionRepository } from './repositories/SubscriptionRepository.js';
import { TicketRepository } from './repositories/TicketRepository.js';
import { UserRepository } from './repositories/UserRepository.js';
import { AuthRoutes } from './routes/auth.routes.js';
import { NotificationRoutes } from './routes/notification.routes.js';
import { SubscriptionRoutes } from './routes/subscription.routes.js';
import { TicketRoutes } from './routes/ticket.routes.js';
import { UserRoutes } from './routes/user.routes.js';
import { AuthService } from './services/AuthService.js';
import { NotificationService } from './services/NotificationService.js';
import { SubscriptionService } from './services/SubscriptionService.js';
import { TicketService } from './services/TicketService.js';
import { UserService } from './services/UserService.js';

async function bootstrap(): Promise<void> {
  const database = DatabaseConnection.getInstance();
  await database.connect();
  console.log('[DB] Conexión establecida con PostgreSQL');

  await database.getSequelize().sync();
  console.log('[DB] Modelos sincronizados');

  const userRepository = new UserRepository();
  const roleRepository = new RoleRepository();
  const ticketRepository = new TicketRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const notificationRepository = new NotificationRepository();

  await seed(userRepository, roleRepository);

  const eventPublisher = new EventPublisher();
  const inAppNotifier = new InAppNotifier(notificationRepository);
  const consoleNotifier = new ConsoleNotifierAdapter();
  const notifierFactory = new NotifierFactory(inAppNotifier, consoleNotifier);

  const notificationService = new NotificationService(
    notificationRepository,
    subscriptionRepository,
    userRepository,
    notifierFactory,
  );
  eventPublisher.attach(notificationService);

  const authService = new AuthService(userRepository, roleRepository);
  const userService = new UserService(userRepository, roleRepository);
  const ticketService = new TicketService(ticketRepository, eventPublisher);
  const subscriptionService = new SubscriptionService(subscriptionRepository, ticketRepository);

  const authController = new AuthController(authService);
  const userController = new UserController(userService);
  const ticketController = new TicketController(ticketService);
  const subscriptionController = new SubscriptionController(subscriptionService);
  const notificationController = new NotificationController(notificationService);

  const authenticate = createAuthenticate(userRepository);

  const routers = [
    { basePath: '/auth', router: new AuthRoutes(authController).routes },
    { basePath: '/users', router: new UserRoutes(userController, authenticate).routes },
    { basePath: '/tickets', router: new TicketRoutes(ticketController, authenticate).routes },
    {
      basePath: '/tickets',
      router: new SubscriptionRoutes(subscriptionController, authenticate).routes,
    },
    {
      basePath: '/notifications',
      router: new NotificationRoutes(notificationController, authenticate).routes,
    },
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

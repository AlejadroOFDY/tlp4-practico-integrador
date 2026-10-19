# Patrones de diseño y principios SOLID

Documentación de dónde se aplica cada patrón y cada principio SOLID en el backend.

---

## Patrones de diseño

### Singleton — `DatabaseConnection`

**Archivo:** `backend/src/db/DatabaseConnection.ts`

**Problema que resuelve:** toda la aplicación debe usar una única instancia de `Sequelize`. Sin el patrón, cada repositorio podría crear su propia conexión y multiplicar los pools contra PostgreSQL. El constructor es privado y `getInstance()` garantiza la instancia única.

```ts
export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private readonly sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
      host: env.db.host,
      port: env.db.port,
      dialect: 'postgres',
    });
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}
```

---

### Observer — `ISubject`, `IObserver`, `EventPublisher`, `NotificationService`

**Archivos:**
- `backend/src/observer/ISubject.ts`
- `backend/src/observer/IObserver.ts`
- `backend/src/observer/EventPublisher.ts`
- `backend/src/services/NotificationService.ts`
- `backend/src/services/TicketService.ts`

**Problema que resuelve:** cuando cambia el estado de un ticket, no queremos que `TicketService` conozca las notificaciones. El servicio solo publica un evento; `EventPublisher` avisa a sus observadores y `NotificationService` reacciona consultando las suscripciones. Agregar otra reacción no toca `TicketService`. La implementación es propia, no usa `EventEmitter`.

```ts
// TicketService.changeStatus()
await this.eventPublisher.notify({
  ticketId: updatedTicket.id,
  title: updatedTicket.title,
  previousStatus,
  newStatus,
});

// EventPublisher (Subject)
async notify(event: TicketStatusEvent): Promise<void> {
  for (const observer of this.observers) {
    await observer.update(event);
  }
}

// NotificationService (Observer)
export class NotificationService implements IObserver {
  async update(event: TicketStatusEvent): Promise<void> {
    const subscriptions = await this.subscriptionRepository.findByTicketId(event.ticketId);
    // ...notifica a cada suscriptor
  }
}
```

---

### Factory — `NotifierFactory`

**Archivo:** `backend/src/notifications/NotifierFactory.ts`

**Problema que resuelve:** `NotificationService` necesita enviar por distintos canales pero no debe instanciarlos con `new`. La factory recibe el tipo de canal y devuelve el `INotifier` correspondiente.

```ts
export type NotifierChannel = 'inapp' | 'console';

export class NotifierFactory {
  constructor(
    private readonly inAppNotifier: INotifier,
    private readonly consoleNotifier: INotifier,
  ) {}

  create(channel: NotifierChannel): INotifier {
    if (channel === 'console') {
      return this.consoleNotifier;
    }
    return this.inAppNotifier;
  }
}
```

---

### Adapter — `ConsoleNotifierAdapter`

**Archivo:** `backend/src/notifications/ConsoleNotifierAdapter.ts`

**Problema que resuelve:** la aplicación espera canales que implementen `INotifier` (reciben `NotificationData` y devuelven `Promise<void>`). `console.log` recibe texto y no devuelve nada. El adapter traduce un formato al otro.

```ts
export class ConsoleNotifierAdapter implements INotifier {
  async send(data: NotificationData): Promise<void> {
    const text = `[NOTIFICACIÓN] Para: ${data.userEmail} | Ticket #${data.ticketId} | Estado: ${data.previousStatus} → ${data.newStatus}`;
    console.log(text);
  }
}
```

---

## Principios SOLID

### S — Responsabilidad única

**Archivos:** `backend/src/controllers/TicketController.ts`, `backend/src/services/TicketService.ts`, `backend/src/repositories/TicketRepository.ts`

Cada capa tiene una sola responsabilidad: el controller maneja HTTP, el service las reglas de negocio y el repository el acceso a la base de datos.

```ts
// Controller: solo HTTP
const ticket = await this.ticketService.create({
  title: request.body.title,
  description: request.body.description,
});
response.status(201).json(ticket);

// Service: regla de negocio + evento
const updatedTicket = await this.ticketRepository.update(id, { status });

// Repository: solo Sequelize
return Ticket.findByPk(id);
```

---

### O — Abierto/cerrado

**Archivos:** `backend/src/notifications/INotifier.ts`, `backend/src/notifications/NotifierFactory.ts`

Agregar un canal nuevo (por ejemplo, email) consiste en crear una clase que implemente `INotifier` y registrarla en la factory. `NotificationService` no se modifica.

```ts
export interface INotifier {
  send(data: NotificationData): Promise<void>;
}

// Nueva implementación sin tocar NotificationService:
export class EmailNotifier implements INotifier {
  async send(data: NotificationData): Promise<void> {
    // ...
  }
}
```

---

### L — Sustitución de Liskov

**Archivos:** `backend/src/notifications/InAppNotifier.ts`, `backend/src/notifications/ConsoleNotifierAdapter.ts`, `backend/src/main.ts`

Cualquier `INotifier` puede reemplazar a otro. `InAppNotifier` y `ConsoleNotifierAdapter` se usan indistintamente como `INotifier` en la factory y en el cableado.

```ts
const notifierFactory = new NotifierFactory(
  new InAppNotifier(notificationRepository),
  new ConsoleNotifierAdapter(),
);
```

---

### I — Segregación de interfaces

**Archivos:** `backend/src/repositories/interfaces/IUserRepository.ts`, `ITicketRepository.ts`, `ISubscriptionRepository.ts`, `INotificationRepository.ts`, `IRoleRepository.ts`

Las interfaces de repositorio son chicas y específicas. Cada una declara solo los métodos que su consumidor necesita.

```ts
export interface ISubscriptionRepository {
  create(userId: number, ticketId: number): Promise<Subscription>;
  findByUserAndTicket(userId: number, ticketId: number): Promise<Subscription | null>;
  findByTicketId(ticketId: number): Promise<Subscription[]>;
  delete(userId: number, ticketId: number): Promise<boolean>;
}
```

---

### D — Inversión de dependencias

**Archivos:** `backend/src/services/TicketService.ts`, `backend/src/services/NotificationService.ts`, `backend/src/main.ts`

Los services dependen de interfaces (`ITicketRepository`, `ISubject`, `INotifier`), no de las implementaciones concretas. El cableado concreto ocurre únicamente en `main.ts`.

```ts
export class TicketService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly eventPublisher: ISubject,
  ) {}
}
```

```ts
// main.ts (composition root)
const ticketService = new TicketService(ticketRepository, eventPublisher);
```

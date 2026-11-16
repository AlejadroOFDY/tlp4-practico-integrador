# tlp4-practico-integrador

**Dominio:** A — Mesa de ayuda (Ticket)
**Base de datos:** PostgreSQL + Sequelize
**Organización del backend:** Carpeta por tipo de archivo

## Integrantes

- Recalde, Alejandro E. — AlejandroOFDY
- Ruíz Díaz, Ruben A. — Clocky97

## Descripción

Aplicación de mesa de ayuda para gestionar tickets con estados (`ABIERTO`, `EN_PROGRESO`, `RESUELTO`, `CERRADO`). Incluye autenticación con JWT, roles y permisos, suscripciones a tickets y notificaciones por dos canales (in-app y consola). El backend está escrito en TypeScript con Express y Sequelize, aplicando POO, SOLID y los patrones Singleton, Observer, Factory y Adapter.

## Requisitos previos

- Docker y Docker Compose
- Git
- (Opcional, para desarrollo local) Node.js 24

## Cómo ejecutar el proyecto

1. Clonar el repositorio:
   ```bash
   git clone [url]
   cd tlp4-practico-integrador
   ```
2. Crear el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
3. Levantar los servicios:
   ```bash
   docker compose up --build
   ```
4. El seed de roles, permisos y usuarios de prueba se ejecuta automáticamente al arrancar el backend.
5. Abrir la API:
   - API: http://localhost:4000/api
   - Healthcheck: http://localhost:4000/api/health

## Ejecución sin Docker (opcional)

1. Crear la base de datos `tp_integrador` en un PostgreSQL local.
2. Copiar las variables de entorno del backend:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Ajustar `DB_USER` y `DB_PASSWORD` según el PostgreSQL local.
3. Instalar dependencias y ejecutar:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

## Variables de entorno

| Variable       | Descripción                    | Ejemplo                     |
| -------------- | ------------------------------ | --------------------------- |
| `DB_HOST`      | Host de la base de datos       | `db`                        |
| `DB_PORT`      | Puerto de la base de datos     | `5432`                      |
| `DB_USER`      | Usuario                        | `tlp4`                      |
| `DB_PASSWORD`  | Contraseña                     | `tlp4`                      |
| `DB_NAME`      | Nombre de la base              | `tp_integrador`             |
| `JWT_SECRET`   | Clave para firmar los tokens   | `cambiar-esto`              |
| `PORT`         | Puerto del backend             | `4000`                      |
| `VITE_API_URL` | URL de la API para el frontend | `http://localhost:4000/api` |

## Usuarios de prueba

| Rol      | Email           | Contraseña  |
| -------- | --------------- | ----------- |
| admin    | admin@tp.com    | Admin123    |
| operador | operador@tp.com | Operador123 |
| usuario  | usuario@tp.com  | Usuario123  |

## Cómo probar el flujo de notificaciones

1. Ingresar como `usuario@tp.com` y suscribirse a un ticket.
2. En otra ventana (o en incógnito), ingresar como `operador@tp.com` y cambiar el estado de ese ticket.
3. Volver a la sesión de `usuario`: la notificación aparece en la bandeja (`GET /api/notifications`) y en el contador de no leídas.
4. Verificar la notificación en la consola del backend:
   ```bash
   docker compose logs backend
   ```
   Debe aparecer una línea como:
   ```
   [NOTIFICACIÓN] Para: usuario@tp.com | Ticket #1 | Estado: ABIERTO → EN_PROGRESO
   ```

## Endpoints principales

| Método | Ruta                             | Permiso requerido      |
| ------ | -------------------------------- | ---------------------- |
| GET    | `/api/health`                    | —                      |
| POST   | `/api/auth/register`             | —                      |
| POST   | `/api/auth/login`                | —                      |
| GET    | `/api/users`                     | `user:read`            |
| PATCH  | `/api/users/:id/role`            | `user:assign-role`     |
| GET    | `/api/tickets`                   | `ticket:read`          |
| GET    | `/api/tickets/:id`               | `ticket:read`          |
| POST   | `/api/tickets`                   | `ticket:create`        |
| PUT    | `/api/tickets/:id`               | `ticket:update`        |
| PATCH  | `/api/tickets/:id/status`        | `ticket:change-status` |
| DELETE | `/api/tickets/:id`               | `ticket:delete`        |
| POST   | `/api/tickets/:id/subscribe`     | `subscription:create`  |
| DELETE | `/api/tickets/:id/subscribe`     | `subscription:delete`  |
| GET    | `/api/tickets/:id/subscribe`     | `subscription:create`  |
| GET    | `/api/notifications`             | `notification:read`    |
| GET    | `/api/notifications/unread-count`| `notification:read`    |
| PATCH  | `/api/notifications/:id/read`    | `notification:read`    |
| PATCH  | `/api/notifications/read-all`    | `notification:read`    |

## Frontend

Pendiente de integración por el compañero de frontend. Debe agregarse como servicio `frontend` en `docker-compose.yml` (ya hay un comentario guía) usando `VITE_API_URL=http://localhost:4000/api`. La URL esperada del frontend es http://localhost:5173.

## Patrones y principios SOLID

Ver [PATTERNS.md](./PATTERNS.md).

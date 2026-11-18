# ClickOn Monorepo

Production-ready modern URL shortener SaaS with granular click analytics, real-time live counters, and high-performance edge redirection. Managed with `pnpm` workspaces and Turborepo.

---

## Workspace Structure

```
clickon/
├── apps/
│   ├── backend/                # Express 4 + TypeScript REST API & WebSocket server
│   │   ├── drizzle/            # Auto-generated Drizzle ORM migrations
│   │   ├── src/
│   │   │   ├── config/         # Environment schemas (Zod) & limits/tier gates
│   │   │   ├── controllers/    # Request handlers (auth, links, redirect, contact)
│   │   │   ├── db/             # Drizzle client, table schemas & seed script
│   │   │   ├── middleware/     # Auth, rate-limiting, error handling
│   │   │   ├── routes/         # Express router definitions
│   │   │   ├── services/       # Core business logic & aggregations
│   │   │   ├── sockets/        # Socket.io real-time click stream
│   │   │   ├── types/          # Shared TypeScript interfaces & declarations
│   │   │   ├── utils/          # Tokens, geo/device parsers, shortcodes, validators
│   │   │   ├── validators/     # Zod request payload schemas
│   │   │   ├── app.ts          # Express application factory
│   │   │   └── server.ts       # HTTP & WebSocket server entrypoint
│   │   └── tests/              # Vitest + Supertest integration test suite
│   └── frontend/               # React 19 + Vite + Tailwind CSS + shadcn UI
├── tooling/
│   ├── eslint-config/          # Shared ESLint flat configurations
│   └── tsconfig/               # Centralized TypeScript tsconfig presets
├── docker-compose.yml          # PostgreSQL 16 & Redis 7 local services
├── package.json
└── pnpm-workspace.yaml
```

---

## Prerequisites

- **Node.js**: `>= 22.0.0`
- **Package Manager**: `pnpm` `>= 9.0.0`
- **Database & Cache**: Docker & Docker Compose (or locally installed PostgreSQL 16+ and Redis 7+)

---

## Quickstart & Setup

### 1. Install Workspace Dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL and Redis

Start the services defined in `docker-compose.yml`:

```bash
docker compose up -d
```

### 3. Configure Environment Variables

Copy the example environment file for the backend:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Review `apps/backend/.env` to confirm `DATABASE_URL` matches your local setup.

### 4. Push Database Schema & Seed Data

Push the Drizzle ORM schema to PostgreSQL:

```bash
pnpm --filter @clickon/backend db:push
```

Seed the database with demo users (`free@clickon.io` and `nafis@clickon.io`), sample short links, and 7-day click analytics:

```bash
pnpm --filter @clickon/backend db:seed
```

### 5. Run the Application

Start the development servers for both frontend and backend concurrently:

```bash
pnpm dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000) (or [http://localhost:5173](http://localhost:5173))
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

---

## Workspace Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Starts all applications concurrently in watch mode |
| `pnpm build` | Compiles TypeScript across all packages |
| `pnpm lint` | Runs ESLint across all apps and tooling |
| `pnpm format` | Formats all files using Prettier |
| `pnpm --filter @clickon/backend test` | Runs the Vitest integration test suite |
| `pnpm --filter @clickon/backend db:generate` | Generates a new migration from Drizzle schema |
| `pnpm --filter @clickon/backend db:migrate` | Applies pending Drizzle migrations |
| `pnpm --filter @clickon/backend db:push` | Pushes schema directly to database |
| `pnpm --filter @clickon/backend db:seed` | Seeds database with demo FREE and PRO users |
| `pnpm --filter @clickon/backend db:studio` | Launches Drizzle Studio GUI on localhost |

---

## Environment Variables (`apps/backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `postgresql://postgres:postgres@localhost:5432/clickon_db` | PostgreSQL connection string |
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection URL (optional; falls back safely if unavailable) |
| `JWT_ACCESS_SECRET` | Yes | (Dev default provided; required in production >= 32 chars) | Secret key for signing access JWTs |
| `JWT_REFRESH_SECRET` | Yes | (Dev default provided; required in production >= 32 chars) | Secret key for signing refresh JWTs |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token lifespan |
| `JWT_REFRESH_EXPIRES_IN`| No | `7d` | Refresh token lifespan |
| `PORT` | No | `5000` | Express server port |
| `NODE_ENV` | No | `development` | Runtime environment (`development`, `production`, `test`) |
| `BASE_URL` | No | `http://localhost:5000` | Base URL used to construct short links |
| `FRONTEND_URL` | No | `http://localhost:3000` | Allowed CORS origin for credentials |
| `RESEND_API_KEY` | No | Unset | Resend API key for contact email delivery |
| `SMTP_HOST` | No | Unset | SMTP host for email delivery fallback |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_USER` | No | Unset | SMTP username |
| `SMTP_PASS` | No | Unset | SMTP password |
| `CONTACT_EMAIL_TO` | No | `support@clickon.io` | Destination address for contact inquiries |
| `CONTACT_EMAIL_FROM` | No | `noreply@clickon.io` | Sender address for system emails |

---

## API Endpoints

### Response Envelopes

Success:
```json
{
  "success": true,
  "data": { ... }
}
```

Paginated:
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}
```

Error:
```json
{
  "success": false,
  "error": { "code": "BAD_REQUEST", "message": "Detailed error message" }
}
```

### Endpoints Table

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Health check checking DB & Redis connectivity |
| `GET` | `/r/:code` | None | Public 302 redirect & asynchronous click telemetry logger |
| `POST` | `/api/auth/register` | None | Register new user account (`email`, `password`, optional `role`) |
| `POST` | `/api/auth/login` | None | Authenticate credentials; returns `{ accessToken, refreshToken, user }` |
| `POST` | `/api/auth/refresh` | None | Exchange valid refresh token for `{ accessToken }` |
| `POST` | `/api/auth/logout` | Bearer | Revoke refresh token |
| `GET` | `/api/auth/me` | Bearer | Fetch profile of currently authenticated user |
| `POST` | `/api/links` | Bearer | Create new shortened URL (`originalUrl`, optional `customSlug`, `expiresAt`) |
| `GET` | `/api/links` | Bearer | List owner's links with pagination and search |
| `GET` | `/api/links/:id` | Bearer | Retrieve single link by ID (scoped to owner) |
| `PATCH` | `/api/links/:id` | Bearer | Update destination URL, toggle `isActive`, or update `expiresAt` |
| `DELETE`| `/api/links/:id` | Bearer | Delete link (scoped to owner; invalidates cache) |
| `GET` | `/api/links/:id/analytics`| Bearer | Aggregated metrics (`totalClicks`, `topCountries`, `topDevices`, `clicksByDay`) |
| `POST` | `/api/contact` | None | Submit customer or abuse inquiry with honeypot spam protection |

---

## Real-Time WebSocket Events

The backend mounts a `socket.io` server over the HTTP port.

- **Handshake**: Authenticated with JWT token passed via `auth.token` or `Authorization: Bearer <token>`.
- **Rooms**: Clients join `link:{id}` after link ownership is validated.
- **Event**: `click:new` (and alias `click`) emitted whenever a redirect occurs:
  ```json
  {
    "linkId": 1,
    "country": "United States",
    "device": "Desktop (Chrome)",
    "timestamp": "2026-11-19T03:30:00.000Z",
    "totalClicks": 1421
  }
  ```

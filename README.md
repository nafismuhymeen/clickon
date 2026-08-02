# ClickOn Monorepo

Monorepo structure for ClickOn application, managed with `pnpm` workspaces.

## Structure

- **`apps/frontend`**: React / Vite frontend application.
- **`apps/backend`**: Express JS / Node.js backend service.
- **`tooling/tsconfig`**: Shared TypeScript configuration packages.
- **`tooling/eslint-config`**: Shared ESLint configuration rules.

## Commands

- `pnpm dev`: Run all apps concurrently in development mode.
- `pnpm build`: Build all workspace projects.
- `pnpm lint`: Lint code across all packages.
- `pnpm format`: Format codebase with Prettier.

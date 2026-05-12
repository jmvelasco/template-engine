## Why

To support future scalability, separation of concerns, and clean architectural boundaries, we need to transition the current template engine kata from a monolithic structure to a monorepository. This will allow the backend (template parsing engine) and frontend (user interface) to reside in the same repository but operate as independent, decoupled applications, aligning with hexagonal architecture (backend) and frontend pattern standards.

## What Changes

- **Project Scaffolding**: Setup an `npm workspaces`-based monorepo containing two separate applications under `apps/`:
  - `apps/backend`: Node.js/TypeScript application for template parsing, following Hexagonal Architecture.
  - `apps/web`: React/TypeScript web client with Vite for the user interface.
- **Root Infrastructure**: Reposition root TypeScript, ESLint, Prettier, and Jest configurations to orchestrate multiple workspaces.
- **Code Migration**: Relocate existing template parsing core logic (`src/core/template-engine.ts`) and tests into the backend package as a baseline.
- **Clean slate**: Remove old `src/` directory from the root.

## Capabilities

### New Capabilities

- `monorepo-structure`: Establishes the foundational monorepo structure with `apps/backend` and `apps/web` scaffolded with their configuration files, package JSONs, typescript configurations, and root orchestrations.

### Modified Capabilities

_(None)_

## Non-goals

- Implementing any REST endpoints, HTTP server, or API routers in `apps/backend`.
- Implementing any actual UI components, form handling, or key/value dictionary inputs in `apps/web`.
- Adding any new business rules or placeholder parsing logic beyond what already exists in `template-engine.ts`.
- Setting up cross-workspace imports or shared packages at this stage.

## Impact

- **Root project configuration**: Changes to root `package.json`, `tsconfig.json`, and `jest.config.js` to manage workspaces and run commands/tests across packages.
- **Code location**: The existing `src/` directory will be deleted, and its contents will be moved to `apps/backend/src`.
- **Scripts**: Root scripts will be updated to target specific workspaces or execute across all workspaces (e.g. `npm run test` or `npm run lint`).

## Context

Currently, the template-engine is a monolithic Node/TypeScript project with code inside the root `src/` directory. To support expansion into a web interface and a backend service, we are converting the repository into a monorepo structure.

## Goals / Non-Goals

**Goals:**

- Configure an npm workspaces monorepo declaring `apps/backend` and `apps/web` as independent packages.
- Move existing parsing core logic and tests to `apps/backend/src/` without regression.
- Scaffold `apps/web` with baseline React/TypeScript configurations.
- Ensure all root quality commands (`test`, `lint`, `format:check`, `compile`) work seamlessly across all workspaces.

**Non-Goals:**

- Implementing web server/routing functionality in `apps/backend`.
- Implementing UI components, state management, or actual styling in `apps/web`.

## Decisions

### 1. Workspace Configuration using npm Workspaces

We will use native npm workspaces to avoid complex monorepo tooling (like Turborepo or Nx) since our needs are currently small and simple.

- **RATIONALE**: Native npm workspaces are robust, require no external dependencies, and integrate natively with Node and npm scripts.
- **ALTERNATIVES CONSIDERED**: Turborepo, pnpm workspaces. Refused due to YAGNI and the desire to keep tooling minimal.

### 2. Root Package as Orchestrator

The root `package.json` will serve as the orchestrator. It will hold workspace definitions and general developer tools (like Husky, Prettier, and lint-staged).

- **RATIONALE**: Centralizing formatting and linting keeps code styles uniform across the entire repository.
- **SCRIPTS**: Root scripts like `npm run test` and `npm run compile` will delegate tasks using workspace flags (e.g., `npm run test -w apps/backend` or running globally via `-ws`).

### 3. Separation of TS Configurations

Each workspace will have its own `tsconfig.json` extending the root configuration.

- **RATIONALE**: Backend (`apps/backend`) targets Node Next/ES2022 while frontend (`apps/web`) targets React runtime and DOM typings. Independent configurations allow each to build correctly without mixing library environments.

### 4. Code Migration Path

Move the contents of `src/` to `apps/backend/src/`.

- `src/core/template-engine.ts` → `apps/backend/src/domain/template-engine.ts` (as the core domain)
- `src/tests/template-engine.test.ts` → `apps/backend/src/tests/template-engine.test.ts`
- **RATIONALE**: Placing the template engine directly in `domain/` aligns with Hexagonal Architecture guidelines, where core business rules live in the innermost layer.

## Risks / Trade-offs

- **Risk: Path Reference Breakages** → Converting to a monorepo changes import paths. Mitigation: Configure tsconfig pathways and update file paths in test imports during migration.
- **Risk: Run/Validation Failure** → Running `npm run test` globally might fail if the web app tests are not configured properly. Mitigation: Stub a basic test in `apps/web` so that workspace runs compile and pass without errors.

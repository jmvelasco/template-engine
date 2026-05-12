## Context

The current `apps/backend` contains a domain service `template-engine.ts` with a `render` function that writes logs directly to standard stdout via a local `logger` function. We are moving to a full monorepo setup where `apps/backend` exposes a REST API and `apps/web` contains a Single Page React application.

This design decouples logging from the core domain logic using the Hexagonal Architecture Ports and Adapters pattern (`ParseNotifier`), implements a REST API using Express, and builds an interactive, premium frontend application with React 19.

## Goals / Non-Goals

**Goals:**

- **Decouple Notifications**: Move console logging out of the domain using the `ParseNotifier` port (interface).
- **Fully Pure Algorithm**: Refactor the parsing algorithm to be pure and side-effect free, eliminating any mutations to parameter collections.
- **Expose REST API**: Provide a robust HTTP endpoint (`POST /api/parse`) for template parsing and event log collection.
- **Build Premium UI**: Provide a responsive, high-fidelity single-page web UI using React 19, CSS Modules, and custom hooks.
- **Maintain TDD Rigor**: Implement backend layers and frontend logic strictly through Test-Driven Development (TDD) using Jest and Vitest.

**Non-Goals:**

- DB persistence (templates/dictionaries/history).
- Auth/User accounts.
- Multi-page routing on frontend.
- CLI/Console stdout output compatibility (we are removing the legacy `logger` and standard output logs entirely).

## Decisions

### 1. Naming Refactoring: "render" to "parse"

To align with the domain vocabulary of a "Template Engine", all occurrences of `render` in the codebase will be refactored to `parse` (e.g., `parse` function, `ParseTemplateUseCase`, `/api/parse` route). This maintains the "One concept, one name" coding standard.

### 2. Hexagonal Ports and Adapters for Parsing events (ParseNotifier)

We will define an interface `ParseNotifier` in the domain layer. The domain `parse` function will accept an implementation of this interface.

- **Port (`apps/backend/src/domain/ports/parse-notifier.ts`)**:
  ```typescript
  export interface ParseEvent {
    type: "SUCCESS" | "WARNING";
    message: string;
  }
  export interface ParseNotifier {
    notify(event: ParseEvent): void;
  }
  ```
- **Adapter (`apps/backend/src/infrastructure/adapters/in-memory-parse-notifier.ts`)**: Collects events in an array, allowing the controller to fetch them and send them back in the JSON API response.
- **Console Logger Elimination**: In accordance with the Tech Lead's decision, standard console stdout logging is retired, simplifying our adapters and eliminating console-specific side-effects.

### 3. Pure Algorithmic Design (No Mutations)

The original template engine algorithm recursive implementation mutated its arguments by deleting keys (`delete variables[key]`). We will implement a fully pure, declarative algorithm that analyzes the template string and variables map without mutating any parameter collections. This follows the functional guidelines of `coding-standards.md` ("Don't mutate collections").

### 4. Application Layer Orchestration (UseCase)

We will introduce `ParseTemplateUseCase` in the application layer to coordinate the parse process:

1. Instantiates or receives an `InMemoryParseNotifier`.
2. Invokes the domain `parse` function.
3. Retrieves recorded events from the notifier and returns a unified result object.

### 5. REST API with Express and CORS

We will scaffold a simple Express server on port 3001 in `apps/backend/src/infrastructure/entrypoints/api/server.ts` with a controller `parse.controller.ts` mapping the `POST /api/parse` route.

### 6. Frontend Architecture with Custom Hooks and CSS Modules

Following the `frontend-patterns` skill rules:

- **State Management**: Extracted entirely to a custom hook `useTemplateParser` inside `apps/web/src/infrastructure/ui/App/useTemplateParser.ts`.
- **Components**: `App` component will handle pure rendering, using CSS Modules `App.module.css` for styling (no TailwindCSS, using custom CSS Variables for dark mode and glassmorphism).
- **API Client**: A simple fetch client in `apps/web/src/infrastructure/api/template-parser-client.ts` will connect to the backend.

---

## Risks / Trade-offs

- **[Risk] CORS Conflicts**: The React frontend (port 5173) calling the API backend (port 3001).
  - **Mitigation**: Add the `cors` package to `apps/backend` and enable it.

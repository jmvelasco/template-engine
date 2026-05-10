## Context

The project is currently a single-package TypeScript codebase implementing a simple template engine kata with CLI logging. To support an interactive playground, we need to transition this into a monorepo setup containing a backend (API parser) and a frontend (React Web UI). 

We also need to transition the core parsing engine from throwing exceptions or printing directly to `stdout` to an accumulative "Notifier" pattern. This pattern will capture warning/success events during parsing and report them as part of a rich HTTP response, which the React UI will render inside a system terminal log.

## Goals / Non-Goals

**Goals:**
- **Monorepo setup**: Partition the project into `apps/backend` (Express, Hexagonal Architecture) and `apps/web` (Vite, React, CSS Modules).
- **Domain Refactor (Notifier Pattern)**: Rewrite the parser inside `apps/backend` using strict TDD to accumulate detailed warnings and success indicators into a rich `ParsingResult`.
- **Interactive UI**: Develop a responsive, dark-themed dashboard in `apps/web` supporting dynamic variable creation (Option C), loading states, and a visual notifier logs console.
- **Clean Architecture & Strict Compliance**: Adhere to backend hexagonal rules, zero-dependency domain models, custom hook rules (single useState, no destructuring), and pure CSS Modules.

**Non-Goals:**
- **Database Persistence**: No user logins, sessions, or saved templates. All state is temporary and UI-driven.
- **External Utility CSS**: Avoid Tailwind CSS, Bootstrap, or inline styles.
- **External State Management**: No Redux, MobX, or complex Context state trees. Only pure React custom hooks.

## Decisions

### 1. Monorepo Organization (npm Workspaces)
We will utilize npm Workspaces to divide the code into `apps/backend` and `apps/web`.
- *Rationale*: Allows running scripts globally from the root (e.g., `npm run lint`, `npm test`) while keeping backend and frontend dependencies entirely isolated.
- *Alternatives considered*: Lerna or PNPM. Selected npm Workspaces as it is built-in and sufficient for this kata, avoiding third-party overhead.

### 2. Notifier Pattern integration in Domain
Instead of importing third-party logger utilities or printing to `stdout`, the domain `Template` will execute parsing and accumulate events in a pure class `ParsingNotifier`.
- *Rationale*: Keeps the domain 100% pure (zero external or Node-specific dependencies) so it remains perfectly portable to any environment. It also lets us return the exact list of notifications to the API caller.

### 3. State Management via a Single Hook in React
Local UI state (template, table of variables, result, loading state, error) will be managed via a single custom hook `useTemplateParser` inside `apps/web`.
- *Rationale*: Aligning with React custom hooks rules. Managing state as a single unified object ensures state transitions are atomic, preventing inconsistent mid-states, and keeps presenter components highly focused.

### 4. Manual Dependency Injection
Manual wiring in composition roots (`apps/backend/src/index.ts` and `apps/web/src/main.tsx`).
- *Rationale*: Keeps the project lightweight and simple (YAGNI). We don't need DI framework overhead.

### 5. Dual Hexagonal Architecture & Separation of Concerns (Backend vs Frontend)
To avoid architectural confusion between the backend and frontend application boundaries, we establish a strict separation based on execution paradigms:
- **Backend Hexagonal (`apps/backend`)**: Governed by the `backend-hexagonal` skill. Pure request-response paradigm.
  - *Domain*: Core `Template` entity, pure types, and `ParsingNotifier` with **ZERO external or React dependencies**.
  - *Application*: Pure Use Cases coordinating domain flow.
  - *Infrastructure*: Express HTTP routing, controllers, and manual composition root.
- **Frontend Hexagonal (`apps/web`)**: Governed by the `frontend-patterns` and `react-best-practices` skills. Fully reactive, state-driven cycle.
  - *Domain*: Read-only TypeScript interfaces mapping response payloads. No template parsing logic is duplicated on the client.
  - *Application/Hooks*: React Custom Hooks (`application/`) managing atomic UI state transitions.
  - *Infrastructure/Store*: `store` layer wrapping React Query and API Client adapters, using Context exclusively for Dependency Injection (DI) of use cases.
  - *UI Presentation*: Modular UI components (`ui/`) with CSS Modules, using props as `props.x` with **zero direct Use Case imports or destructuring**.

Comparison matrix:
| Concept | Backend (Request/Response) | Frontend React (Reactive UI) |
|---|---|---|
| **Domain** | Entities, Value Objects, Notifier | Type interfaces, pure formatting |
| **Orchestration** | Use Cases | Custom UI Hooks (`application/`) |
| **Ports** | Interfaces in Domain | API Client Abstractions |
| **Adapters** | Express Controllers | `infrastructure/store` & API Client |
| **Presentation** | External Consumers (e.g. apps/web) | React Components (`ui/`) |

## Risks / Trade-offs

- **[Risk] Monorepo Configuration Overheads** → *Mitigation*: Configure clean scripts at the root level so `npm run dev` and `npm test` execute across both workspaces seamlessly.
- **[Risk] Invalid JSON or keys during parsing API call** → *Mitigation*: The frontend hook compiles the variable rows list into a clean `Record<string, string | null>` before sending the payload, validating entries. The backend safely handles empty/null values returning proper notifications.

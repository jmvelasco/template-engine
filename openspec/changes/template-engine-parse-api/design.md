## Context

The repository contains a monorepo with `apps/backend` and `apps/web`. The backend has a single `render` function in `apps/backend/src/core/template-engine.ts` that replaces `${key}` placeholders in a string using a dictionary. It logs messages to `process.stdout.write` and mutates the input dictionary. The web app is empty. There is no HTTP server, no API, and no UI.

The codebase follows hexagonal architecture (backend-hexagonal skill), frontend-patterns skill for React, and strict TDD with XP methodology.

## Goals / Non-Goals

**Goals:**
- Restructure the backend following hexagonal architecture: domain (TemplateEngine, ParseResult, Notification, Notifier), application (ParseTemplateUseCase), infrastructure (Express server, controller)
- Replace stdout logging with Notifier pattern that returns structured notifications as part of the result
- Expose a REST API endpoint `POST /parse`
- Build a React + Vite web UI following frontend-patterns skill (all React code in `infrastructure/ui/`)
- Handle all edge cases: escaped placeholders, values with placeholder syntax, null values, malformed placeholders
- Dark theme only, minimalista design with UX patterns

**Non-Goals:**
- Template persistence, history, or user accounts
- Light mode or theme switching
- Recursive resolution of placeholders in values
- WebSocket or real-time features
- Server-side rendering

## Decisions

### 1. Notifier Pattern over Console Logging

**Decision**: Replace `logger(message)` → `process.stdout.write` with an immutable Notifier that accumulates `Notification` objects and returns them as part of `ParseResult`.

**Alternatives considered**:
- Event emitter pattern: Over-engineered for this use case, adds async complexity
- Callback injection: Couples the caller to notification handling

**Rationale**: The Notifier is a pure value object — no side effects, testable in isolation, and naturally serializable for HTTP responses.

### 2. ParseResult as Rich Domain Object

**Decision**: `parse()` returns `ParseResult { text, notifications[] }` with a derived `status()` method that computes the overall status from the notification types.

**Status derivation logic**:
- All notifications are `success` → `"success"`
- Mix of `success` + `warning`/`error` → `"partial"`
- Only `warning`/`info`, no `success` → `"warning"`
- Template empty or no placeholders → `"info"`

**Rationale**: Status is derived, not stored. Single source of truth from the notifications array. Follows rich domain model (not anemic).

### 3. Express for HTTP Server

**Decision**: Use Express as the HTTP framework.

**Alternatives considered**:
- Hono: More modern but less ecosystem support and the user chose Express
- Fastify: Heavier setup for a single endpoint

**Rationale**: User preference. Express is mature, well-known, and sufficient for a single endpoint.

### 4. Backend Hexagonal Layer Structure

**Decision**:
```
apps/backend/src/
├── domain/           # TemplateEngine, ParseResult, Notification, Notifier
├── application/      # ParseTemplateUseCase
├── infrastructure/
│   └── http/         # ExpressServer, ParseTemplateController
└── index.ts          # Composition root
```

**Rationale**: Follows backend-hexagonal skill. Domain has zero external dependencies. Use case orchestrates. Infrastructure adapts Express to the domain contract. Manual DI in composition root — no framework needed.

### 5. Shared API Types Package

**Decision**: Create `packages/api-types` (`@template-engine/api-types`) containing the types that define the API contract between backend and frontend: `ParseRequest`, `ParseResponse`, `Notification`, `NotificationType`, `ParseStatus`.

```
packages/api-types/
├── package.json       # @template-engine/api-types
├── tsconfig.json
└── src/
    └── index.ts       # Type-only exports
```

**Alternatives considered**:
- Duplicate types in each app's domain: Risks silent divergence; a typo in one side doesn't break compilation
- Shared `contract` package: Too generic a name; invites non-type content
- Shared `types` package: Catch-all name, doesn't specify types of what

**Rationale**: `api-types` is concrete — it says exactly what it contains (API types) and acts as a naming barrier against putting logic in it. The monorepo already uses npm workspaces, so adding a workspace is near zero cost. Both apps import the same types, so a contract change in one place produces compilation errors in both — single source of truth.

**What goes in api-types**:
- `NotificationType` (literal union: success | warning | error | info)
- `ParseStatus` (literal union: success | partial | warning)
- `Notification` (interface: type + message)
- `ParseRequest` (interface: template + variables)
- `ParseResponse` (interface: text + status + notifications)

**What does NOT go in api-types**:
- `Notifier` (backend domain behavior)
- `ParseResult` class with `status()` method (backend domain, rich object)
- `TemplateEnginePort` (frontend domain port)
- Any logic or behavior

### 6. Frontend Hexagonal Structure

**Decision**:
```
apps/web/src/
├── domain/                    # TemplateEnginePort (interface), re-exports from api-types
├── infrastructure/
│   ├── api/                   # HttpTemplateEngine (implements Port via fetch)
│   ├── ui/
│   │   ├── App/               # Root component + AppContainer (wiring)
│   │   ├── TemplateInput/     # Template textarea
│   │   ├── VariablesEditor/   # Dynamic key/value table
│   │   ├── ParseButton/       # Action button
│   │   ├── ResultDisplay/     # Processed text + status badge
│   │   ├── ProcessingLog/     # Notification list
│   │   └── hooks/             # useTemplateEngine.hook.ts
│   └── factory.ts             # Composition root
├── globals.css                # CSS variables, reset, dark theme
└── main.tsx
```

**Rationale**: Follows frontend-patterns skill strictly — all React code (components, hooks, CSS Modules) lives in `infrastructure/ui/`. Domain contains only the port interface; API types come from `@template-engine/api-types`. Container pattern for wiring (no React Query needed). The hook receives `TemplateEnginePort` via parameter (DI).

### 7. Container Pattern for Frontend Wiring

**Decision**: Use Container pattern (not Wired Page) since this project has no caching or React Query needs.

**Flow**: `Factory` → `AppContainer` (creates adapter, passes via props) → `App` (presentational, receives port) → `useTemplateEngine(port)` hook.

**Rationale**: Simplest wiring pattern from frontend-patterns skill. No store layer needed.

### 8. Values Containing Placeholder Syntax Treated as Literals

**Decision**: If a variable value contains `${...}` syntax (e.g., `{ name: "${greeting} World" }`), treat it as literal text and emit a warning notification. Do NOT resolve recursively.

**Rationale**: Recursive resolution risks infinite loops (`a → ${b}`, `b → ${a}`). Detecting cycles adds complexity with no clear user value. Literal treatment is safe and predictable.

### 9. Placeholder Validation Rules

**Decision**:
- Valid placeholder: `${key}` where key contains one or more non-whitespace characters
- Escaped placeholder: `\${key}` → preserved as literal `${key}`, backslash removed
- Malformed: `${}`, `${ }`, `${ name }` → not recognized as placeholders, left as-is

**Rationale**: Strict validation prevents surprising behavior. Whitespace in placeholder names would create ambiguity.

## Risks / Trade-offs

- **[Risk] Current tests will break** → Mitigation: New tests written from scratch via TDD. Old tests serve as behavioral reference but the function name, signature, and return type all change.
- **[Risk] CORS between Vite dev server and Express** → Mitigation: Add `cors` middleware to Express with configurable origins.
- **[Risk] Frontend port interface may diverge from backend response** → Mitigation: Both apps import API types from `@template-engine/api-types`. A change in one place produces compilation errors in both.
- **[Trade-off] Extra workspace for types only** → Accepted: Minimal overhead (types-only package, no tests, no logic). Justified by single source of truth and architectural kata value.

## Why

The template engine currently exists as a standalone TypeScript function with console logging for diagnostics. To practice hexagonal architecture in a monorepo setup, we need to evolve it into a full-stack application with a backend API and a minimal web interface.

## What Changes

- Restructure the project as an npm workspaces monorepo (`apps/backend`, `apps/web`)
- Replace the current `render()` function with a `parse()` method on a `TemplateEngine` rich domain model that returns a `ParseResult` value object (parsed text + notifications)
- Remove the `logger` side effect from the domain; replace with a notification pattern (`replaced`, `missing-variable`, `null-value`, `unused-variable`)
- Expose the template engine via an Express HTTP API (`POST /api/parse`)
- Build a minimal React 19 + Vite web interface: template input, variables input, parsed result display with notifications
- Organize both backend and frontend as vertical slices (`parse-template/`)
- Backend follows hexagonal architecture (domain → application → infrastructure)
- Frontend follows the `frontend-patterns` skill (Wired Page, Context DI, store mutations, CSS Modules)

## Non-goals

- Template history or persistence
- User authentication
- Multiple template syntax formats
- Server-side rendering
- Deployment or CI/CD pipeline

## Capabilities

### New Capabilities

- `template-parsing`: Domain logic for parsing templates with variable substitution, producing a rich result with text and diagnostic notifications
- `parse-api`: Express HTTP endpoint (`POST /api/parse`) that exposes the template parsing capability
- `parse-ui`: Minimal React web interface with template input, variables editor, parsed output, and notification display
- `monorepo-setup`: npm workspaces monorepo structure with `apps/backend` and `apps/web`

### Modified Capabilities

_(none — no existing specs)_

## Impact

- **Code**: Current `src/core/template-engine.ts` and `src/tests/` move into `apps/backend/src/parse-template/domain/` with signature and return type changes (`render` → `parse`, string → `ParseResult`)
- **Dependencies**: New dependencies — Express (backend), React 19, Vite 7, React Query (frontend), Vitest (frontend testing)
- **Project structure**: Root `package.json` becomes workspaces root; current `jest.config.js`, `tsconfig.json` need per-workspace equivalents
- **APIs**: New `POST /api/parse` endpoint accepting `{ template: string, variables: Record<string, string | null> }` and returning `{ text: string, notifications: ParseNotification[] }`

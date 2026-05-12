## Why

The current template engine is a standalone function that logs to stdout and returns only a string. To make it useful as a product, it needs: (1) a structured response with processing feedback (success, warnings, errors) instead of console logs, (2) a REST API so clients can consume it, and (3) a web UI where users can input templates and variable dictionaries and see detailed processing results. Additionally, the current implementation has edge cases not contemplated (escaped placeholders, values containing placeholder syntax, null values) that need to be addressed.

## What Changes

- **BREAKING**: Rename `render` to `parse` — the concept is a Template Engine that parses, not renders
- **BREAKING**: Replace `logger` (stdout) with a Notifier pattern — `parse` returns a `ParseResult` with processed text and an array of `Notification` messages (success/warning/error/info)
- **BREAKING**: `parse` returns `ParseResult { text, notifications }` instead of plain `string`
- Remove mutation of the input dictionary (current `delete variables[key]`)
- Add new edge case handling: escaped placeholders (`\${name}`), values containing `${...}` syntax (treated as literals), malformed placeholders (`${}`, `${ name }`), null values
- Add Express REST API with `POST /parse` endpoint
- Add React + Vite web UI with dark theme, minimalista design: template textarea, dynamic key/value editor, result display with status badge, and processing log with color-coded notifications

## Non-goals

- No authentication or authorization
- No template persistence or history
- No real-time collaboration
- No recursive resolution of placeholders inside values (values containing `${...}` are treated as literals to prevent infinite loops)
- No light mode — dark mode only

## Capabilities

### New Capabilities

- `template-parsing`: Core domain logic — `parse(template, variables)` returning `ParseResult` with Notifier pattern. Covers all replacement scenarios, edge cases, and notification types
- `parse-rest-api`: Express HTTP endpoint `POST /parse` that receives template + variables and returns structured JSON response with processed text, status, and notifications
- `parse-web-ui`: React + Vite web interface with template input, dynamic variables editor, parse button, result display with status badge, and processing log. Dark theme, CSS Modules, hexagonal architecture with `TemplateEnginePort`

### Modified Capabilities

_(none — no existing specs)_

## Impact

- **Backend domain** (`apps/backend/src/core/`): Current `template-engine.ts` and tests will be replaced by new domain classes following hexagonal architecture under `apps/backend/src/domain/`
- **Backend infrastructure**: New Express server, controller, and composition root under `apps/backend/src/infrastructure/`
- **Backend application**: New `ParseTemplateUseCase` under `apps/backend/src/application/`
- **Frontend** (`apps/web/src/`): Entirely new — React + Vite setup, components in `infrastructure/ui/`, API adapter, domain types
- **Shared package**: New `packages/api-types` (`@template-engine/api-types`) with API request/response types used by both backend and frontend
- **Dependencies**: Express (backend), React + Vite (frontend), CORS middleware
- **API surface**: New `POST /parse` endpoint

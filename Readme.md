# Template Engine

## Description

A **template engine** that takes a text template containing named placeholders (`${key}`) and a set of key-value pairs, and produces a new string where every placeholder has been replaced by its corresponding value. Returns structured results with notifications about each operation (replacements, warnings, errors).

## Architecture

Fullstack monorepo with hexagonal architecture:

```
template-engine/
├── packages/
│   └── api-types/              # Shared TypeScript types (ParseRequest, ParseResponse, etc.)
├── apps/
│   ├── backend/                # Express 5 REST API (domain → application → infrastructure)
│   │   └── src/
│   │       ├── domain/         # TemplateEngine, Notification, Notifier, ParseResult
│   │       ├── application/    # ParseTemplateUseCase
│   │       └── infrastructure/ # ExpressServer, ParseTemplateController
│   └── web/                    # React 19 + Vite UI
│       └── src/
│           ├── domain/         # TemplateEngine interface (port)
│           └── infrastructure/ # HttpTemplateEngine adapter, factory, UI components
```

## Getting Started

### Prerequisites

- Node.js >= 22
- npm >= 10

### Install dependencies

```bash
npm install
```

### Run the application

Start the backend (port 3000):

```bash
npm start --workspace=apps/backend
```

Start the frontend dev server (port 5173, proxies `/parse` to backend):

```bash
npm run dev --workspace=apps/web
```

Open `http://localhost:5173` in your browser.

### API Usage

```bash
curl -X POST http://localhost:3000/parse \
  -H "Content-Type: application/json" \
  -d '{"template": "Hello, ${name}!", "variables": {"name": "Ada"}}'
```

Response:

```json
{
  "text": "Hello, Ada!",
  "status": "success",
  "notifications": [
    { "type": "success", "message": "Replaced placeholder: name" }
  ]
}
```

## Rules

- Placeholders follow the pattern `${variable_name}`
- If a variable in the template has no matching key in the map, it is left as-is with a warning notification
- If a variable appears multiple times, all occurrences are replaced (single notification)
- Escaped placeholders (`\${key}`) are converted to literal `${key}`
- Null values skip replacement with a warning notification
- Values containing `${...}` syntax are treated as literal text
- Malformed placeholders (`${}`, `${ name }`) are left as-is

## Scripts

### Root (monorepo)

```bash
npm install             # Install all workspace dependencies
npm test                # Run all tests (backend + frontend)
npm run lint            # Lint all workspaces
npm run lint:fix        # Lint and auto-fix
npm run format          # Format with Prettier
npm run validate        # Lint + test
```

### Backend (`apps/backend`)

```bash
npm start --workspace=apps/backend              # Start Express server (port 3000)
npm test --workspace=apps/backend               # Run Jest tests
npm run test:watch --workspace=apps/backend     # Watch mode
npm run test:coverage --workspace=apps/backend  # Coverage report
npm run compile --workspace=apps/backend        # Type-check
```

### Frontend (`apps/web`)

```bash
npm run dev --workspace=apps/web                # Vite dev server (port 5173)
npm test --workspace=apps/web                   # Run Vitest tests
npm run test:watch --workspace=apps/web         # Watch mode
npm run build --workspace=apps/web              # Production build
npm run preview --workspace=apps/web            # Preview production build
```

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Backend  | TypeScript, Express 5, Jest, ts-jest |
| Frontend | TypeScript, React 19, Vite, Vitest  |
| Shared   | `@template-engine/api-types`        |

## What this kata practices

- Hexagonal architecture (ports and adapters)
- Test-driven development (TDD) with Transformation Priority Premise
- String manipulation and regular expressions
- Monorepo with npm workspaces
- Fullstack TypeScript

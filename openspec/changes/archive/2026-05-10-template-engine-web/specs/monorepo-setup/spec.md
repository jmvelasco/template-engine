## ADDED Requirements

### Requirement: npm workspaces monorepo
The project SHALL be structured as an npm workspaces monorepo with a root `package.json` defining workspaces `["apps/*"]`.

#### Scenario: Workspace structure
- **WHEN** inspecting the project root
- **THEN** there SHALL be `apps/backend/` and `apps/web/` directories
- **AND** each SHALL have its own `package.json`

#### Scenario: Independent dependencies
- **WHEN** installing dependencies
- **THEN** backend dependencies (Express, Jest) SHALL be in `apps/backend/package.json`
- **AND** frontend dependencies (React, Vite, Vitest) SHALL be in `apps/web/package.json`

### Requirement: TypeScript configuration
Each workspace SHALL have its own `tsconfig.json` with appropriate settings for its runtime (Node.js for backend, browser for frontend).

#### Scenario: Backend TypeScript config
- **WHEN** compiling the backend
- **THEN** the TypeScript config SHALL target Node.js with CommonJS or ESM module resolution

#### Scenario: Frontend TypeScript config
- **WHEN** compiling the frontend
- **THEN** the TypeScript config SHALL target the browser with JSX support for React 19

### Requirement: Test configuration
Each workspace SHALL have its own test configuration.

#### Scenario: Backend uses Jest
- **WHEN** running backend tests
- **THEN** Jest SHALL be configured in `apps/backend/`

#### Scenario: Frontend uses Vitest
- **WHEN** running frontend tests
- **THEN** Vitest SHALL be configured in `apps/web/`

## ADDED Requirements

### Requirement: Monorepo Structure with npm Workspaces

The repository SHALL be structured as a monorepo using npm workspaces. It SHALL contain two applications inside the `apps` directory: `backend` and `web`.

#### Scenario: Verify root package JSON contains workspaces

- **WHEN** reading the root `package.json`
- **THEN** it MUST contain a `workspaces` field declaring `apps/backend` and `apps/web`

### Requirement: Backend App Scaffolding and Code Relocation

The existing `template-engine` code and tests SHALL be relocated to `apps/backend/src`, and any root-level remnants of the previous monolith's source code SHALL be removed.

#### Scenario: Verify relocated backend tests pass

- **WHEN** running tests in the `apps/backend` workspace
- **THEN** all tests MUST pass successfully and existing template parsing functionality remains intact

### Requirement: Web App Scaffolding

A web application workspace `apps/web` SHALL be scaffolded with TypeScript and React configuration to establish a baseline structure.

#### Scenario: Verify web app scaffolding

- **WHEN** checking the `apps/web` workspace directory
- **THEN** it MUST contain `package.json`, `tsconfig.json`, and basic React configuration files.

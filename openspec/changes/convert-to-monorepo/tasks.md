## 1. Monorepo Structural Configuration

- [x] 1.1 Update root `package.json` to configure npm workspaces for `apps/backend` and `apps/web`. ⚙️ (Rule: `config.yaml` workspaces)
- [x] 1.2 Update root `tsconfig.json` to support monorepo and workspace references if applicable. 🛠️ (Rule: `config.yaml` typescript)
- [x] 1.3 Update root `jest.config.js` to target workspace projects. 🃏 (Rule: `testing-standards.md`)

## 2. Backend Application Scaffolding and Code Migration

- [x] 2.1 Create the directory structure for `apps/backend/src/domain` and `apps/backend/src/tests`. 📂 (Rule: `backend-hexagonal` layers)
- [x] 2.2 Create `apps/backend/package.json` defining dependencies, name, and script boundaries. 📦 (Rule: `backend-hexagonal`)
- [x] 2.3 Create `apps/backend/tsconfig.json` and `apps/backend/jest.config.js` to allow backend-specific lint, compile, and test. 🔧 (Rule: `backend-hexagonal`)
- [x] 2.4 Relocate existing template parsing logic to `apps/backend/src/domain/template-engine.ts`. 🧪 (Rule: `backend-hexagonal` - pure domain logic)
- [x] 2.5 Relocate existing template parsing tests to `apps/backend/src/tests/template-engine.test.ts`. 🎯 (Rule: `testing-standards.md` & `tdd.md`)
- [x] 2.6 Run tests in `apps/backend` to verify relocated logic is fully green and works perfectly. 🧪 (Rule: `tdd.md` - RED/GREEN/REFACTOR)
- [x] 2.7 Remove root `src/` directory and old monolithic configs to complete migration. 🗑️ (Rule: YAGNI)

## 3. Web Application Scaffolding

- [x] 3.1 Create `apps/web` application structure with directories following `frontend-patterns`. 📂 (Rule: `frontend-patterns`)
- [x] 3.2 Create `apps/web/package.json` with base React 19, TS 5, and Vite 7. 📦 (Rule: `frontend-patterns`)
- [x] 3.3 Create `apps/web/tsconfig.json` and Vite configuration files. 🛠️ (Rule: `frontend-patterns`)
- [x] 3.4 Create basic index, main, and boilerplate app component to ensure development server can build. 🖥️ (Rule: `frontend-patterns` - styling and components)
- [x] 3.5 Create a simple dummy test inside `apps/web` to verify workspace test orchestration compiles and passes. 🃏 (Rule: `testing-standards.md`)

## 4. Quality Checks and Workspace Verification

- [x] 4.1 Run `npm run format:fix` globally to format all modified and newly scaffolded files. 🎨 (Rule: `config.yaml` formatting)
- [x] 4.2 Execute `npm run validate` (or root level checks) to verify linting, compilation, and testing work flawlessly across all workspaces. 🚀 (Rule: `config.yaml` verification)
- [x] 4.3 Run `npx tsc --noEmit` in both workspace directories to verify there are no broken imports or type mismatches. 🔍 (Rule: `config.yaml` typecheck)

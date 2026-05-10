## 1. Monorepo Setup & Workspace Configuration

- [x] 1.1 Restructure directories by creating `apps/backend` and `apps/web`
- [x] 1.2 Move existing `src/core/template-engine.ts` and `src/tests` into `apps/backend` as baseline files
- [x] 1.3 Initialize `package.json` configurations in root, `apps/backend`, and `apps/web` with proper npm workspaces
- [x] 1.4 Set up base TypeScript config files (`tsconfig.json`) across the workspace and workspaces

## 2. Backend Domain & Notifier (TDD)

- [x] 2.1 Write initial RED test for the Notifier and rich result in `apps/backend/tests/unit/domain/Template.test.ts`
- [x] 2.2 Implement Domain Types and `ParsingNotifier` class with GREEN status returning success on empty strings
- [x] 2.3 Progressively add test cases for single/multiple matching placeholders and implement them following TPP
- [x] 2.4 Add test cases for null values and missing placeholder keys, verifying correct warning notification codes
- [x] 2.5 Add test cases for partial parser success, and unused dictionary values, achieving GREEN state for all edge cases
- [x] 2.6 Refactor domain code to eliminate duplication and ensure adherence to coding standards (no comments, short functions)

## 3. Backend Application & Infrastructure

- [x] 3.1 Create `ParseTemplateUseCase.ts` in `apps/backend/src/application/` to orchestrate parsing, and add unit tests
- [x] 3.2 Create the HTTP controller and Express server in `apps/backend/src/infrastructure/http/` to expose POST `/api/parse`
- [x] 3.3 Set up manual dependency injection in `apps/backend/src/index.ts` (composition root)
- [x] 3.4 Create E2E/integration tests verifying the full API flow from HTTP requests to parsing responses

## 4. Frontend Workspace & Tooling Setup

- [x] 4.1 Initialize React/Vite development scaffolding inside `apps/web`
- [x] 4.2 Configure Vitest (or Jest), ESLint, and Prettier rules in the frontend workspace matching existing code-standards
- [x] 4.3 Add necessary shared types, Maybe monad implementation, and API helper client to fetch parsing results from the backend

## 5. Frontend Custom Hook Implementation (TDD)

- [x] 5.1 Create unit test `useTemplateParser.test.tsx` targeting the central custom hook
- [x] 5.2 Implement RED state for initial hook state (template, variables table, result, isParsing, error)
- [x] 5.3 Implement atomic state mutations for adding/editing/removing variables (Option C) and template updates, verifying in GREEN
- [ ] 5.4 Implement the asynchronous parsing request inside the custom hook and mock/fake the API call to achieve green tests
- [ ] 5.5 Refactor hook logic to ensure 0-3 parameters, single useState object, no nested helper functions, and no destructuring

## 6. Frontend Presentation Components (CSS Modules)

- [ ] 6.1 Create base CSS variables and global layout inside `apps/web/src/index.css`
- [ ] 6.2 Implement `VariableTable` (Option C) using CSS Modules for key-value row insertion, modification, and removal
- [ ] 6.3 Implement `TemplateForm` textarea with premium hover/focus states and submit actions
- [ ] 6.4 Implement `ResultPresenter` displaying the parsed text with visual colored badges for SUCCESS, PARTIAL, and FAILED status
- [ ] 6.5 Implement `NotificationPanel` mimicking a terminal console window showing severity-colored warnings from the notifier
- [ ] 6.6 Wire all components inside `App.tsx` following the Container/Wired Page pattern (props.x, hook.property, no destructuring)

## 7. QA, Integration & Validation

- [ ] 7.1 Verify complete end-to-end full stack flow locally by running backend API and Vite UI together
- [ ] 7.2 Run unified validation script `npm run validate` checking compiling, linting, formatting, and testing across the entire monorepo

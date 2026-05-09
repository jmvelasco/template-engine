## 1. Monorepo Setup

- [x] 1.1 Create npm workspaces monorepo structure with `apps/backend` and `apps/web` directories, root `package.json` with `"workspaces": ["apps/*"]`, and per-workspace `package.json` and `tsconfig.json` files 📐 _monorepo-setup spec_
- [x] 1.2 Move existing `src/core/template-engine.ts` and `src/tests/template-engine.test.ts` to `apps/backend/src/parse-template/domain/` and `apps/backend/src/parse-template/tests/unit/`. Configure Jest for the backend workspace. Verify existing tests pass ♻️ _structural refactor, keep green_
- [x] 1.3 Scaffold `apps/web` with Vite + React 19 + TypeScript 5. Configure Vitest. Verify the dev server starts and a smoke test passes 📐 _monorepo-setup spec_

## 2. Backend Domain — ParseResult & TemplateEngine

> 🧪 _TDD: REASON → RED → GREEN → REFACTOR → RE-EVALUATE_
> 📏 _coding-standards, testing-standards, backend-hexagonal skill (domain purity, rich domain model)_

- [x] 2.1 **REASON**: List and organize all domain test cases from the `template-parsing` spec. Write them as a TODO list in the test file. Validate with Tech Lead before starting
- [x] 2.2 **TDD cycle**: `ParseResult` value object — parse a template with no placeholders returns unchanged text and empty notifications
- [x] 2.3 **TDD cycle**: Single placeholder replacement — returns parsed text with `replaced` notification (key, value, occurrences)
- [x] 2.4 **TDD cycle**: Multiple occurrences of the same placeholder — occurrences count is correct
- [x] 2.5 **TDD cycle**: Multiple different placeholders — each produces its own `replaced` notification
- [x] 2.6 **TDD cycle**: Missing variable — placeholder stays, `missing-variable` notification produced
- [x] 2.7 **TDD cycle**: Null value — placeholder stays, `null-value` notification produced
- [x] 2.8 **TDD cycle**: Unused variable — `unused-variable` notification produced
- [x] 2.9 **TDD cycle**: Mixed scenario — replaced + missing + null + unused in one parse call
- [x] 2.10 Run `npm run format:fix` on all backend code changes

## 3. Backend Application — ParseTemplateUseCase

> 🧪 _TDD: REASON → RED → GREEN → REFACTOR → RE-EVALUATE_
> 📏 _backend-hexagonal skill (use case orchestration, constructor injection), testing-standards (test doubles over mocks)_

- [x] 3.1 **REASON**: Identify use case test cases — use case delegates to `TemplateEngine.parse()` and returns the `ParseResult`
- [x] 3.2 **TDD cycle**: `ParseTemplateUseCase.execute(template, variables)` delegates to `TemplateEngine` and returns `ParseResult`
- [x] 3.3 Run `npm run format:fix` on all backend code changes

## 4. Backend Infrastructure — Express HTTP Adapter

> 🧪 _TDD: REASON → RED → GREEN → REFACTOR → RE-EVALUATE_
> 📏 _backend-hexagonal skill (adapter implementation, no business logic in adapters), parse-api spec_

- [ ] 4.1 **REASON**: List HTTP adapter test cases from the `parse-api` spec (success, missing fields, invalid JSON, CORS)
- [ ] 4.2 **TDD cycle**: `POST /api/parse` with valid body returns 200 and `ParseResult` JSON
- [ ] 4.3 **TDD cycle**: `POST /api/parse` with missing `template` field returns 400
- [ ] 4.4 **TDD cycle**: `POST /api/parse` with missing `variables` field returns 400
- [ ] 4.5 Add CORS middleware for cross-origin requests from web frontend 📐 _parse-api spec_
- [ ] 4.6 Wire composition root in `index.ts` — manual DI, no framework 📐 _backend-hexagonal skill (manual DI)_
- [ ] 4.7 Run `npm run format:fix` on all backend code changes

## 5. Frontend Infrastructure — API Adapter & DI

> 📏 _frontend-patterns skill (store layer, context DI, wired page pattern)_

- [ ] 5.1 Create `parseTemplateApi.ts` — fetch adapter for `POST /api/parse`
- [ ] 5.2 Create `ParseTemplateUseCase.ts` (frontend) — calls the API adapter
- [ ] 5.3 Create `TemplateUseCases.context.ts` — Context for DI of use cases
- [ ] 5.4 Create `Template.mutations.ts` — `useMutation` store hook that obtains use case from Context
- [ ] 5.5 Create `AppProviders.tsx` — composes Context provider with React Query's `QueryClientProvider`
- [ ] 5.6 Run `npm run format:fix` on all web code changes

## 6. Frontend UI — Components

> 🧪 _TDD: REASON → RED → GREEN → REFACTOR → RE-EVALUATE (Vitest)_
> 📏 _frontend-patterns skill (props.x, single useState, CSS Modules, no destructuring), parse-ui spec_

- [ ] 6.1 **REASON**: List UI component test cases from the `parse-ui` spec
- [ ] 6.2 **TDD cycle**: `TemplateInput` — textarea component for template input
- [ ] 6.3 **TDD cycle**: `VariablesInput` — key-value editor for variables
- [ ] 6.4 **TDD cycle**: `ParseResult` — displays parsed text and notifications with visual indicators
- [ ] 6.5 **TDD cycle**: `TemplatePage` — composes inputs, button, result; triggers mutation on click
- [ ] 6.6 Create `TemplateWiredPage.tsx` — Factory + AppProviders wiring 📐 _frontend-patterns skill (wired page pattern)_
- [ ] 6.7 Wire `TemplateWiredPage` into `main.tsx` as the app entry point
- [ ] 6.8 Run `npm run format:fix` on all web code changes

## 7. Integration Verification

- [ ] 7.1 Start backend and web dev servers, verify end-to-end flow: enter template + variables → click Parse → see result with notifications
- [ ] 7.2 Run full validation: `npm run validate` in both workspaces

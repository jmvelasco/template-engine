## 1. Shared API Types Package

- [x] 1.1 Create `packages/api-types` workspace — `package.json` (`@template-engine/api-types`), `tsconfig.json`, `src/index.ts` — 📐 project config
- [x] 1.2 Define API types: `NotificationType`, `ParseStatus`, `Notification`, `ParseRequest`, `ParseResponse` — pure type exports, zero logic — 📐 coding-standards §Names, backend-hexagonal §1 Domain Purity
- [x] 1.3 Register `packages/api-types` in root `package.json` workspaces array and add as dependency in `apps/backend` and `apps/web` — 📐 project config

## 2. Backend Domain — Notification and Notifier

- [x] 2.1 🔴🟢🔵 TDD: Create `Notification` value object with `type` and `message` properties (imports `NotificationType` from `@template-engine/api-types`) — 📐 backend-hexagonal §1 Domain Purity, coding-standards §Classes
- [x] 2.2 🔴🟢🔵 TDD: Create `Notifier` immutable accumulator — factory methods `addSuccess()`, `addWarning()`, `addError()`, `addInfo()` return new Notifier instance; `notifications()` returns collected list — 📐 coding-standards §Functions (CQS, immutability)

## 3. Backend Domain — ParseResult

- [x] 3.1 🔴🟢🔵 TDD: Create `ParseResult` value object with `text` and `notifications` — 📐 backend-hexagonal §1.2 Rich Domain Models
- [x] 3.2 🔴🟢🔵 TDD: `ParseResult.status()` derives status from notifications — success (all success+info), partial (mix success+warning), warning (only warning/info) — 📐 coding-standards §Functions (CQS queries)

## 4. Backend Domain — TemplateEngine.parse()

- [x] 4.1 🔴🟢🔵 TDD: `parse` returns unchanged template + info notification for empty template — 📐 tdd-workflow (TPP: {} → constant)
- [x] 4.2 🔴🟢🔵 TDD: `parse` returns unchanged template + info for template without placeholders and empty dictionary — 📐 tdd-workflow (TPP: constant → constant+)
- [x] 4.3 🔴🟢🔵 TDD: `parse` returns unchanged template + warning per key when dictionary has keys but template has no placeholders — 📐 tdd-workflow (TPP: unconditional → if)
- [x] 4.4 🔴🟢🔵 TDD: `parse` returns unchanged template + warning per placeholder when template has placeholders but dictionary is empty — 📐 tdd-workflow (TPP: scalar → array)
- [x] 4.5 🔴🟢🔵 TDD: `parse` replaces single placeholder with matching key + success notification — 📐 tdd-workflow (TPP: constant → scalar)
- [x] 4.6 🔴🟢🔵 TDD: `parse` replaces all occurrences of same placeholder + single success notification — 📐 tdd-workflow
- [x] 4.7 🔴🟢🔵 TDD: `parse` replaces multiple different placeholders + success per key — 📐 tdd-workflow
- [x] 4.8 🔴🟢🔵 TDD: `parse` handles partial replacements — matched keys get success, unmatched placeholders get warning, unused keys get warning — 📐 tdd-workflow
- [x] 4.9 🔴🟢🔵 TDD: `parse` skips replacement for null value + warning notification — 📐 tdd-workflow
- [x] 4.10 🔴🟢🔵 TDD: `parse` converts escaped `\${key}` to literal `${key}` + info notification — 📐 tdd-workflow
- [x] 4.11 🔴🟢🔵 TDD: `parse` treats values containing `${...}` syntax as literals + warning notification — 📐 tdd-workflow
- [x] 4.12 🔴🟢🔵 TDD: `parse` ignores malformed placeholders (`${}`, `${ name }`) — leaves them as-is — 📐 tdd-workflow
- [x] 4.13 🔴🟢🔵 TDD: `parse` does not mutate the input dictionary — 📐 coding-standards §Functions (pure functions, no mutation)

## 5. Backend Application — ParseTemplateUseCase

- [x] 5.1 🔴🟢🔵 TDD: Create `ParseTemplateUseCase` — receives template + variables, delegates to `TemplateEngine.parse()`, returns `ParseResult` — 📐 backend-hexagonal §3 Use Case Orchestration

## 6. Backend Infrastructure — Express REST API

- [x] 6.1 Install Express and CORS dependencies (`express`, `cors`, `@types/express`, `@types/cors`) — 📐 backend-hexagonal §4 Adapters
- [x] 6.2 Create `ExpressServer` — configures Express app with JSON parsing and CORS middleware — 📐 backend-hexagonal §4.1 Adapters Implement Domain Ports
- [x] 6.3 🔴🟢🔵 TDD: Create `ParseTemplateController` — maps HTTP request to use case, validates body (template: string, variables: object required), returns structured JSON response — 📐 backend-hexagonal §4.2 No Business Logic in Adapters, testing-standards §E2E
- [x] 6.4 Create composition root `index.ts` — wires domain → application → infrastructure with manual DI — 📐 backend-hexagonal §5.1 Manual DI

## 7. Frontend Setup

- [x] 7.1 Initialize React + Vite + TypeScript project in `apps/web` — install dependencies (react, react-dom, vite, @vitejs/plugin-react, vitest), add `@template-engine/api-types` dependency — 📐 project config
- [x] 7.2 Create `globals.css` with CSS variables for dark theme, reset, and typography — 📐 css-modules reference (variables, typography)

## 8. Frontend Domain

- [x] 8.1 Create `TemplateEnginePort` interface — `parse(template, variables) → Promise<ParseResponse>` — uses types from `@template-engine/api-types` — 📐 backend-hexagonal §2 Ports Design

## 9. Frontend Infrastructure — API Adapter

- [x] 9.1 Create `HttpTemplateEngine` implementing `TemplateEnginePort` — POST to backend `/parse`, response already matches `ParseResponse` from api-types — 📐 backend-hexagonal §4 Adapter Implementation
- [x] 9.2 Create `factory.ts` composition root — creates `HttpTemplateEngine` instance — 📐 backend-hexagonal §5.1 Manual DI

## 10. Frontend Infrastructure — UI Hook

- [x] 10.1 🔴🟢🔵 TDD: Create `useTemplateEngine.hook.ts` — single `useState` with grouped state (template, variables, result, loading, error), functions for updateTemplate, addVariable, removeVariable, updateVariableKey, updateVariableValue, parse — receives `TemplateEnginePort` as parameter — 📐 frontend-patterns §Hooks (single useState, no useEffect, no nested functions, encapsulated state, prev state updates, dependency as parameter)

## 11. Frontend Infrastructure — UI Components

- [x] 11.1 Create `App/App.tsx` + `App.module.css` — root presentational component, receives `TemplateEnginePort` via props, uses `useTemplateEngine` hook, composes child components — 📐 frontend-patterns §Components (no destructuring, Container pattern)
- [x] 11.2 Create `App/AppContainer.tsx` — uses Factory to create adapter, passes to App via props — 📐 frontend-patterns §Components (Container pattern, wiring)
- [x] 11.3 Create `TemplateInput/TemplateInput.tsx` + `TemplateInput.module.css` — textarea with monospace font, resizable — 📐 frontend-patterns §Components, css-modules reference
- [x] 11.4 Create `VariablesEditor/VariablesEditor.tsx` + `VariablesEditor.module.css` — dynamic key/value rows with add/remove — 📐 frontend-patterns §Components, css-modules reference
- [x] 11.5 Create `ParseButton/ParseButton.tsx` + `ParseButton.module.css` — action button with loading state — 📐 css-modules reference (transitions, accessibility)
- [x] 11.6 Create `ResultDisplay/ResultDisplay.tsx` + `ResultDisplay.module.css` — processed text + status badge, progressive disclosure (hidden until first parse) — 📐 frontend-patterns §Components, css-modules reference
- [x] 11.7 Create `ProcessingLog/ProcessingLog.tsx` + `ProcessingLog.module.css` — notification list with color-coded types (green/amber/red/blue) — 📐 frontend-patterns §Components, css-modules reference
- [x] 11.8 Wire `main.tsx` to render `AppContainer` — 📐 frontend-patterns §Components (Container pattern)

## 12. Integration Verification

- [x] 12.1 Run full backend test suite — `npm run test --workspace=apps/backend` — 📐 testing-standards
- [x] 12.2 Start backend server and manually verify `POST /parse` with curl — 📐 backend-hexagonal
- [x] 12.3 Start frontend dev server and verify end-to-end flow — template input → parse → result display — 📐 frontend-patterns

## 1. Domain Refactoring and Ports

- [x] 1.1 Refactor current domain `render` function to `parse` in `apps/backend/src/domain/template-engine.ts`. Implement a fully pure, side-effect free algorithm (no parameter mutations) and completely remove the legacy console `logger` and its tests. 🧪 Notice: Applying TDD Refactor Phase & Coding Standards (No mutations, One concept, one name).
- [x] 1.2 Implement the domain models and ports: create `ParseEvent` type and `ParseNotifier` interface in `apps/backend/src/domain/ports/parse-notifier.ts`. 🏛️ Notice: Applying Hexagonal Architecture Domain Layer guidelines.
- [x] 1.3 Refactor the domain `parse` function to accept a `ParseNotifier` and emit events, adapting existing tests. 🧪 Notice: Applying TDD Red-Green-Refactor with TPP transformations.
- [x] 1.4 Run `npx tsc --noEmit` on the backend workspace to catch broken imports or type errors. 🧹 Notice: Quality Validation step.

## 2. Application Layer and Adapters

- [x] 2.1 Implement the `InMemoryParseNotifier` adapter in `apps/backend/src/infrastructure/adapters/in-memory-parse-notifier.ts` to accumulate events. 🏛️ Notice: Applying Hexagonal Architecture Infrastructure Layer guidelines.
- [x] 2.2 Implement the `ParseTemplateUseCase` in `apps/backend/src/application/use-cases/parse-template.use-case.ts` to orchestrate parsing and gather notifier logs. 🧪 Notice: Applying TDD Inside-Out (Use Case layer).
- [x] 2.3 Run `npx tsc --noEmit` on backend workspace to verify compilation of new classes. 🧹 Notice: Quality Validation step.

## 3. Infrastructure API REST

- [x] 3.1 Install Express, CORS, and their types in the `apps/backend` workspace. 📦 Notice: Applying Dependency management practices.
- [x] 3.2 Scaffold the Express API server and integrations tests in `apps/backend/src/infrastructure/entrypoints/api/server.ts`. 🏛️ Notice: Applying Hexagonal Entrypoints guidelines.
- [x] 3.3 Implement `POST /api/parse` controller routing invoking `ParseTemplateUseCase` and handling bad request validation errors. 🧪 Notice: Applying TDD Integration & E2E Testing with Jest.
- [ ] 3.4 Run `npm run validate` on the backend workspace to ensure format, linting, and tests are clean. 🧹 Notice: Quality Validation step.

## 4. Frontend API Client and Custom Hook

- [ ] 4.1 Implement `TemplateParserClient` in `apps/web/src/infrastructure/api/template-parser-client.ts` to communicate with POST `/api/parse` backend. 🏛️ Notice: Applying Frontend Patterns API Store layer.
- [ ] 4.2 Create the custom hook `useTemplateParser` inside `apps/web/src/infrastructure/ui/App/useTemplateParser.ts` managing editor inputs, dictionary state, loading, and logs. 🧪 Notice: Applying TDD in React Custom Hooks with Vitest.
- [ ] 4.3 Run `npx tsc --noEmit` in the frontend workspace to verify import correctness. 🧹 Notice: Quality Validation step.

## 5. UI Components and Rich Aesthetics

- [ ] 5.1 Design and write CSS Modules in `App.module.css` implementing custom CSS properties, sleek dark mode theme, glassmorphism card panels, and micro-animations. 🎨 Notice: Applying Premium Web Design Aesthetics guidelines.
- [ ] 5.2 Implement double panel layout (Inputs/Dictionary vs Output/Logs timeline) in `App.tsx` using React 19. ⚛️ Notice: Applying React Best Practices and Web Design Guidelines.
- [ ] 5.3 Add dynamic row addition, editing, and deletion to the variables dictionary editor. ⚛️ Notice: Applying React State Composition.
- [ ] 5.4 Run `npm run validate` on the frontend workspace to verify code quality, linting, and vitest runs successfully. 🧹 Notice: Quality Validation step.

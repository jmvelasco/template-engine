## Context

The template engine is a single TypeScript function (`render()`) in `src/core/template-engine.ts` with Jest tests. It uses `process.stdout.write` for diagnostics inside the domain. The project has no monorepo structure, no backend framework, and no frontend.

We need to evolve this into a full-stack hexagonal architecture with vertical slicing, keeping the domain pure.

## Goals / Non-Goals

**Goals:**
- Establish an npm workspaces monorepo with `apps/backend` and `apps/web`
- Refactor the domain to return a rich `ParseResult` value object (text + notifications) instead of a plain string with side effects
- Expose the domain through an Express HTTP API
- Build a minimal React web interface following the `frontend-patterns` skill
- Organize code as vertical slices (`parse-template/`)

**Non-Goals:**
- Template history, persistence, or caching
- WebSocket or real-time preview
- Authentication or authorization
- Production deployment

## Decisions

### 1. Domain model: `TemplateEngine` class with `parse()` method

**Decision**: Rich domain model (class with behavior) returning a `ParseResult` value object.

**Alternatives considered**:
- _Standalone function_: simpler, but the skill mandates rich models over anemic data bags
- _Service class_: violates "tell, don't ask" — logic should live with the data

**Structure**:
```
ParseResult {
  text: string
  notifications: ParseNotification[]
}

ParseNotification =
  | { type: 'replaced';         key: string; value: string; occurrences: number }
  | { type: 'missing-variable'; key: string }
  | { type: 'null-value';       key: string }
  | { type: 'unused-variable';  key: string }
```

### 2. Vertical slicing over flat layers

**Decision**: Organize by feature (`parse-template/`) containing `domain/`, `application/`, `infrastructure/` inside.

**Alternatives considered**:
- _Flat layers_ (`domain/`, `application/`, `infrastructure/` at root): works for a single feature but doesn't scale. Vertical slicing practices the pattern for when more features are added.

**Why**: Each slice is self-contained. The dependency rule (infra → app → domain) is enforced within each slice. Shared infrastructure (Express app setup) lives in `shared/`.

### 3. Express for HTTP adapter

**Decision**: Express as the HTTP framework for the backend.

**Alternatives considered**:
- _Fastify_: better performance and schema validation, but Express is more familiar and sufficient for a single endpoint
- _Hono_: ultra-light but less ecosystem support
- _Native http_: too much boilerplate

### 4. Frontend wiring: Wired Page pattern with mutation-only store

**Decision**: `TemplateWiredPage` uses Factory + AppProviders. Store layer has only `Template.mutations.ts` (no queries). Context provides use cases via DI.

**Alternatives considered**:
- _Container pattern_: simpler, but the skill recommends Wired Page when using React Query store
- _Direct fetch_: bypasses the store layer, loses the architectural practice value

### 5. Notification display in UI

**Decision**: Show notifications below the parsed result with visual indicators (color-coded by type). Minimal UI — no filtering, no dismissing.

### 6. Monorepo with npm workspaces

**Decision**: Root `package.json` defines workspaces `["apps/*"]`. Each app has its own `package.json`, `tsconfig.json`, and test config.

**Alternatives considered**:
- _Turborepo/Nx_: overkill for two packages
- _Single package_: loses the architectural boundary practice

### 7. Backend folder structure

```
apps/backend/src/
├── parse-template/
│   ├── domain/
│   │   ├── TemplateEngine.ts
│   │   ├── ParseResult.ts
│   │   └── ParseNotification.ts
│   ├── application/
│   │   └── ParseTemplateUseCase.ts
│   └── infrastructure/
│       └── ParseTemplateController.ts
├── shared/
│   └── infrastructure/
│       └── http/
│           └── app.ts
└── index.ts
```

### 8. Frontend folder structure

```
apps/web/src/
├── parse-template/
│   ├── application/
│   │   └── ParseTemplateUseCase.ts
│   ├── infrastructure/
│   │   ├── api/
│   │   │   └── parseTemplateApi.ts
│   │   ├── context/
│   │   │   └── TemplateUseCases.context.ts
│   │   └── store/
│   │       └── Template.mutations.ts
│   └── ui/
│       ├── TemplatePage.tsx
│       ├── TemplateInput/
│       │   ├── TemplateInput.tsx
│       │   └── TemplateInput.module.css
│       ├── VariablesInput/
│       │   ├── VariablesInput.tsx
│       │   └── VariablesInput.module.css
│       └── ParseResult/
│           ├── ParseResult.tsx
│           └── ParseResult.module.css
├── shared/
│   └── infrastructure/
│       └── ui/
│           └── AppProviders.tsx
├── TemplateWiredPage.tsx
└── main.tsx
```

## Risks / Trade-offs

- **[Over-engineering for one feature]** → Accepted: this is a kata — the architecture IS the practice goal
- **[ParseResult may evolve]** → The value object is simple enough to refactor if new notification types emerge
- **[Express is legacy-ish]** → Sufficient for a single endpoint kata; no production concerns
- **[Frontend hexagonal adds ceremony]** → Accepted: practicing the full `frontend-patterns` skill is the goal
- **[Existing tests break during migration]** → Migrate tests alongside domain code in the same task; keep green at all times

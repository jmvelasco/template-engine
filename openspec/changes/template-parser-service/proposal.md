## Why

The current template engine implementation is only a domain function and lacks a way to be used by end users through a user interface or an external service. In addition, the current implementation lacks the ability to report details of the parsing process (such as warning of missing variable values or unused variables) in a decoupled, structured manner.

This change introduces a REST API to expose the template parsing capabilities, a structured notifier pattern to track and report parsing process events, and a modern, premium web UI to allow users to interact with the engine.

## What Changes

- **Template Parser API Endpoint**: A new REST endpoint `/api/parse` (POST) that processes a template string and a variables dictionary, returning the parsed text and a list of process logs.
- **Parse Notifier Pattern**: Introducing `ParseNotifier` interface in the domain layer to decouple event logging/tracking from the core parsing logic, with implementations for API response collection (`InMemoryParseNotifier`) and console output (`ConsoleParseNotifier`).
- **Core Engine Renaming**: Refactoring the core engine's primary function and concepts from "render" to "parse" to align with the "Template Parser/Engine" domain vocabulary.
- **Modern Web Interface**: A premium single-page web UI under `apps/web` with layout panel to input template string, define key-value dictionaries, trigger parsing, and show formatted output and detailed processing logs.

## Capabilities

### New Capabilities

- `template-parser`: Provides template parsing functionality with process notification logs through a REST API and a premium, responsive web interface.

### Modified Capabilities

## Non-goals

- Designing a multi-page routing system on the frontend.
- Adding database persistence for templates or parsed results (everything is in-memory and request-scoped).
- Adding user authentication or workspace management.

## Impact

- **Backend code**: `apps/backend/src/domain/template-engine.ts` will be refactored. New application use-cases and infrastructure API controllers will be added.
- **Frontend code**: `apps/web/src` will be fully populated with UI components, custom hooks, and styles.
- **Dependencies**: Express/cors and types on `apps/backend`. Lucide-react for modern icons on `apps/web`.

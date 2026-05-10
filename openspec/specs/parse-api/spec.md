## ADDED Requirements

### Requirement: HTTP endpoint for template parsing
The system SHALL expose a `POST /api/parse` endpoint that accepts a JSON body with `template` (string) and `variables` (object) and returns the `ParseResult` as JSON.

#### Scenario: Successful parse request
- **WHEN** a POST request is sent to `/api/parse` with body `{ "template": "Hello, ${name}!", "variables": { "name": "Ada" } }`
- **THEN** the response status SHALL be `200`
- **AND** the response body SHALL be `{ "text": "Hello, Ada!", "notifications": [{ "type": "replaced", "key": "name", "value": "Ada", "occurrences": 1 }] }`

#### Scenario: Parse request with missing variables
- **WHEN** a POST request is sent to `/api/parse` with body `{ "template": "Hello, ${name}!", "variables": {} }`
- **THEN** the response status SHALL be `200`
- **AND** the response body SHALL include `"text": "Hello, ${name}!"` and a `missing-variable` notification

#### Scenario: Missing template field
- **WHEN** a POST request is sent to `/api/parse` with body `{ "variables": {} }`
- **THEN** the response status SHALL be `400`
- **AND** the response body SHALL contain an error message indicating the `template` field is required

#### Scenario: Missing variables field
- **WHEN** a POST request is sent to `/api/parse` with body `{ "template": "Hello!" }`
- **THEN** the response status SHALL be `400`
- **AND** the response body SHALL contain an error message indicating the `variables` field is required

#### Scenario: Invalid JSON body
- **WHEN** a POST request is sent to `/api/parse` with an invalid JSON body
- **THEN** the response status SHALL be `400`

### Requirement: CORS support
The API SHALL accept cross-origin requests from the web frontend.

#### Scenario: Preflight request
- **WHEN** an OPTIONS request is sent to `/api/parse`
- **THEN** the response SHALL include appropriate CORS headers allowing the web origin

### Requirement: Hexagonal adapter
The HTTP controller SHALL be an infrastructure adapter that delegates to `ParseTemplateUseCase`. It SHALL not contain business logic.

#### Scenario: Controller delegates to use case
- **WHEN** the controller receives a valid request
- **THEN** it SHALL extract `template` and `variables` from the request body
- **AND** call `ParseTemplateUseCase.execute(template, variables)`
- **AND** return the use case result as JSON

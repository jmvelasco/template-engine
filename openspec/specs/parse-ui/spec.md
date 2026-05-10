## ADDED Requirements

### Requirement: Template input
The UI SHALL provide a text area where the user can type or paste a template string with `${variable}` placeholders.

#### Scenario: User enters a template
- **WHEN** the user types `"Hello, ${name}!"` in the template text area
- **THEN** the template value SHALL be captured and available for parsing

### Requirement: Variables input
The UI SHALL provide a key-value editor where the user can define template variables.

#### Scenario: User adds a variable
- **WHEN** the user adds a variable with key `name` and value `Ada`
- **THEN** the variables map SHALL include `{ name: "Ada" }`

#### Scenario: User adds multiple variables
- **WHEN** the user adds variables `name: Ada` and `age: 25`
- **THEN** the variables map SHALL include `{ name: "Ada", age: "25" }`

### Requirement: Parse action
The UI SHALL provide a button that triggers template parsing via the backend API.

#### Scenario: User clicks parse
- **WHEN** the user has entered a template and variables and clicks the "Parse" button
- **THEN** the system SHALL send the template and variables to `POST /api/parse`
- **AND** display the parsed result text

#### Scenario: API error
- **WHEN** the API returns an error
- **THEN** the UI SHALL display an error message to the user

### Requirement: Notification display
The UI SHALL display the notifications returned by the API below the parsed result, with visual differentiation by notification type.

#### Scenario: Replaced notification
- **WHEN** the parse result includes a notification of type `replaced`
- **THEN** the UI SHALL display it with a success visual indicator

#### Scenario: Missing variable notification
- **WHEN** the parse result includes a notification of type `missing-variable`
- **THEN** the UI SHALL display it with a warning visual indicator

#### Scenario: Null value notification
- **WHEN** the parse result includes a notification of type `null-value`
- **THEN** the UI SHALL display it with a warning visual indicator

#### Scenario: Unused variable notification
- **WHEN** the parse result includes a notification of type `unused-variable`
- **THEN** the UI SHALL display it with an info visual indicator

### Requirement: Frontend architecture
The UI SHALL follow the Wired Page pattern from the `frontend-patterns` skill. Components SHALL use `props.x` (no destructuring), CSS Modules for styling, and a single grouped `useState` in hooks.

#### Scenario: Wired Page entry point
- **WHEN** the application loads
- **THEN** `TemplateWiredPage` SHALL create the use case via Factory, wrap the page in AppProviders, and render `TemplatePage`

#### Scenario: Store mutation for parsing
- **WHEN** the parse action is triggered
- **THEN** `Template.mutations.ts` SHALL obtain `ParseTemplateUseCase` from Context and call it via `useMutation`

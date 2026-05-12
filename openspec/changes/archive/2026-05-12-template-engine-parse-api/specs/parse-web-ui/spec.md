## ADDED Requirements

### Requirement: User can input a template text

The web UI SHALL provide a text area where the user can type or paste a template string containing `${key}` placeholders.

#### Scenario: Template input is displayed

- **WHEN** the user opens the application
- **THEN** a text area labeled "Template" SHALL be visible
- **THEN** the text area SHALL accept multi-line input
- **THEN** the text area SHALL be resizable vertically

#### Scenario: Template input uses monospace font

- **WHEN** the template text area is rendered
- **THEN** it SHALL use a monospace font for code-like readability

### Requirement: User can manage a variables dictionary

The web UI SHALL provide a dynamic key/value editor where the user can add, edit, and remove variable entries.

#### Scenario: Empty state

- **WHEN** the user opens the application with no variables added
- **THEN** an "Add variable" button SHALL be visible

#### Scenario: Add a variable row

- **WHEN** the user clicks "Add variable"
- **THEN** a new row with empty key and value inputs SHALL appear

#### Scenario: Edit variable key and value

- **WHEN** a variable row is displayed
- **THEN** the user SHALL be able to type in both the key and value fields

#### Scenario: Remove a variable row

- **WHEN** the user clicks the remove button on a variable row
- **THEN** that row SHALL be removed from the editor

### Requirement: User can trigger template parsing

The web UI SHALL provide a button to send the template and variables to the backend API for processing.

#### Scenario: Parse button is displayed

- **WHEN** the application is loaded
- **THEN** a "Parse Template" button SHALL be visible

#### Scenario: Parse request is sent

- **WHEN** the user clicks "Parse Template"
- **THEN** the application SHALL send a POST request to the backend `/parse` endpoint with the current template and variables

#### Scenario: Loading state during parse

- **WHEN** a parse request is in progress
- **THEN** the parse button SHALL indicate a loading state

### Requirement: User sees the processed result

The web UI SHALL display the parsed text and overall status after processing.

#### Scenario: Result appears after parsing

- **WHEN** the backend returns a successful response
- **THEN** the result section SHALL appear with the processed text
- **THEN** a status badge SHALL indicate the overall result (success, partial, warning)

#### Scenario: Result section hidden before first parse

- **WHEN** no parse has been performed yet
- **THEN** the result section SHALL NOT be visible (progressive disclosure)

#### Scenario: Result text uses monospace font

- **WHEN** the result is displayed
- **THEN** it SHALL use a monospace font matching the template input

### Requirement: User sees a processing log with notifications

The web UI SHALL display a list of processing notifications with visual indicators for each type.

#### Scenario: Notifications are displayed

- **WHEN** the backend returns notifications
- **THEN** each notification SHALL be displayed in a log list

#### Scenario: Notification types are color-coded

- **WHEN** notifications of different types are displayed
- **THEN** `success` notifications SHALL use green visual indicators
- **THEN** `warning` notifications SHALL use yellow/amber visual indicators
- **THEN** `error` notifications SHALL use red visual indicators
- **THEN** `info` notifications SHALL use blue visual indicators

### Requirement: UI uses dark theme

The web UI SHALL use a dark color scheme exclusively.

#### Scenario: Dark theme is applied

- **WHEN** the application loads
- **THEN** the background SHALL be dark
- **THEN** text SHALL be light colored for contrast
- **THEN** interactive elements SHALL use appropriate dark theme colors

### Requirement: UI follows minimalista design

The web UI SHALL follow minimalista design principles with clean layout, generous whitespace, and clear visual hierarchy.

#### Scenario: Clean layout with sections

- **WHEN** the application is rendered
- **THEN** the input section (template + variables + button) and output section (result + log) SHALL be visually separated
- **THEN** sufficient whitespace SHALL exist between sections

#### Scenario: Responsive layout

- **WHEN** the application is viewed on different screen sizes
- **THEN** the layout SHALL adapt using flexbox
- **THEN** a max-width constraint SHALL prevent the content from stretching too wide

### Requirement: UI sends requests through a domain port

The web UI SHALL access the backend through a `TemplateEnginePort` interface, with the HTTP implementation injected via the Container pattern.

#### Scenario: Port abstraction

- **WHEN** the application needs to parse a template
- **THEN** it SHALL call the `TemplateEnginePort.parse()` method
- **THEN** the HTTP adapter SHALL be injected via Factory → Container → props → hook

#### Scenario: Components do not import infrastructure

- **WHEN** presentational components are rendered
- **THEN** they SHALL NOT import `Factory`, `HttpTemplateEngine`, or any infrastructure module directly

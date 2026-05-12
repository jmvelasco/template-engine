## ADDED Requirements

### Requirement: Domain Template Parser with ParseNotifier

The system SHALL parse template strings containing `${variable_name}` placeholders using a variables dictionary and a `ParseNotifier` interface to record execution events.

#### Scenario: Parse template with valid placeholders successfully

- **WHEN** template is `"Hello, ${name}!"` and variables map has `{ "name": "Ada" }`
- **THEN** output MUST be `"Hello, Ada!"` and a success event MUST be recorded: `SUCCESS: Replaced ${name} with 'Ada'`

#### Scenario: Notify warning when placeholder variable value is null

- **WHEN** template is `"Hello, ${name}!"` and variables map has `{ "name": null }`
- **THEN** output MUST be `"Hello, ${name}!"` and a warning event MUST be recorded: `WARNING: No replacements done! key ${name} has no value.`

#### Scenario: Notify warning when dictionary variable is not used

- **WHEN** template is `"Hello!"` and variables map has `{ "age": "21" }`
- **THEN** output MUST be `"Hello!"` and a warning event MUST be recorded: `WARNING: No replacements done! key ${age} not found in the template.`

### Requirement: REST API Template Parser Endpoint

The system SHALL expose a REST endpoint `POST /api/parse` that accepts a template string and variables dictionary, executing the parsing and returning both the parsed result and the recorded events.

#### Scenario: Parse successfully via REST API

- **WHEN** a client sends a `POST /api/parse` request with JSON body containing `template: "Hello, ${name}!"` and `variables: { "name": "Ada" }`
- **THEN** response status MUST be `200 OK` and the body MUST contain the rendered text `"Hello, Ada!"` and a list of parsed events containing the success replacement log.

#### Scenario: Handle validation errors in REST API

- **WHEN** a client sends a `POST /api/parse` request with an empty JSON body or missing `template` parameter
- **THEN** response status MUST be `400 Bad Request` with an appropriate error message indicating that `template` is a required string.

### Requirement: Interactive Template Parser Web UI

The system SHALL provide a single-page web interface where users can input templates, dynamically manage key-value variables, and trigger the parsing process, viewing the parsed output and execution event logs.

#### Scenario: Trigger parsing from the Web UI

- **WHEN** user types `"Dear ${name}, your code is ${quality}."` in the template editor, defines `{ "name": "Alice", "quality": "clean" }` in the variable dictionary list, and clicks "Parse Template"
- **THEN** UI MUST display the parsed result `"Dear Alice, your code is clean."` in the output panel and show a timeline of the two successful replacement event logs.

#### Scenario: Manage dictionary keys and values dynamically

- **WHEN** user clicks "Add Variable" button in the dictionary panel
- **THEN** a new row MUST appear containing empty text inputs for Key and Value, allowing the user to type variable mappings or remove them.

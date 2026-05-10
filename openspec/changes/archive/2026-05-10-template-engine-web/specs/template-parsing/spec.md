## ADDED Requirements

### Requirement: Parse template with variable substitution
The system SHALL replace all `${variable_name}` placeholders in a template string with corresponding values from a variables map, returning a `ParseResult` containing the parsed text and a list of notifications.

#### Scenario: Single placeholder replacement
- **WHEN** `parse` is called with template `"Hello, ${name}!"` and variables `{ name: "Ada" }`
- **THEN** the result text SHALL be `"Hello, Ada!"`
- **AND** notifications SHALL contain one entry of type `replaced` with key `name`, value `Ada`, and occurrences `1`

#### Scenario: Multiple occurrences of the same placeholder
- **WHEN** `parse` is called with template `"${name} meets ${name}"` and variables `{ name: "Ada" }`
- **THEN** the result text SHALL be `"Ada meets Ada"`
- **AND** notifications SHALL contain one entry of type `replaced` with key `name`, value `Ada`, and occurrences `2`

#### Scenario: Multiple different placeholders
- **WHEN** `parse` is called with template `"${greeting}, ${name}!"` and variables `{ greeting: "Hi", name: "Bob" }`
- **THEN** the result text SHALL be `"Hi, Bob!"`
- **AND** notifications SHALL contain two entries of type `replaced`

#### Scenario: Template with no placeholders
- **WHEN** `parse` is called with template `"No placeholders"` and variables `{}`
- **THEN** the result text SHALL be `"No placeholders"`
- **AND** notifications SHALL be empty

#### Scenario: Empty template
- **WHEN** `parse` is called with template `""` and any variables
- **THEN** the result text SHALL be `""`

### Requirement: Notify missing variables
The system SHALL produce a `missing-variable` notification for each placeholder in the template that has no corresponding key in the variables map. The placeholder SHALL remain in the output text unchanged.

#### Scenario: Placeholder without matching variable
- **WHEN** `parse` is called with template `"Hello, ${name}!"` and variables `{}`
- **THEN** the result text SHALL be `"Hello, ${name}!"`
- **AND** notifications SHALL contain one entry of type `missing-variable` with key `name`

#### Scenario: Some placeholders matched, some missing
- **WHEN** `parse` is called with template `"${greeting}, ${name}!"` and variables `{ greeting: "Hi" }`
- **THEN** the result text SHALL be `"Hi, ${name}!"`
- **AND** notifications SHALL contain one `replaced` for `greeting` and one `missing-variable` for `name`

### Requirement: Notify null values
The system SHALL produce a `null-value` notification when a variable key exists in the map but its value is `null`. The placeholder SHALL remain in the output text unchanged.

#### Scenario: Variable with null value
- **WHEN** `parse` is called with template `"Hello, ${name}!"` and variables `{ name: null }`
- **THEN** the result text SHALL be `"Hello, ${name}!"`
- **AND** notifications SHALL contain one entry of type `null-value` with key `name`

### Requirement: Notify unused variables
The system SHALL produce an `unused-variable` notification for each key in the variables map that does not match any placeholder in the template.

#### Scenario: Variable provided but not in template
- **WHEN** `parse` is called with template `"Hello, world!"` and variables `{ age: "25" }`
- **THEN** the result text SHALL be `"Hello, world!"`
- **AND** notifications SHALL contain one entry of type `unused-variable` with key `age`

#### Scenario: Mixed used and unused variables
- **WHEN** `parse` is called with template `"Hello, ${name}!"` and variables `{ name: "Ada", age: "25" }`
- **THEN** the result text SHALL be `"Hello, Ada!"`
- **AND** notifications SHALL contain one `replaced` for `name` and one `unused-variable` for `age`

### Requirement: ParseResult is a domain value object
The `ParseResult` SHALL be an immutable value object containing `text` (string) and `notifications` (array of `ParseNotification`). The domain SHALL have zero external dependencies.

#### Scenario: ParseResult structure
- **WHEN** `parse` returns a result
- **THEN** the result SHALL have a `text` property of type string
- **AND** the result SHALL have a `notifications` property that is an array of `ParseNotification`

#### Scenario: Domain purity
- **WHEN** inspecting the domain module imports
- **THEN** there SHALL be zero imports from infrastructure, application, or Node.js built-in modules (except `node:assert`)

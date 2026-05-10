## ADDED Requirements

### Requirement: Parse valid placeholders
The parsing engine SHALL replace valid placeholders `${variable}` with matching values from the variables dictionary.

#### Scenario: Single matching placeholder
- **WHEN** template is `"Hello, ${name}!"` and variables map has `{ "name": "Ada" }`
- **THEN** the engine returns rendered text `"Hello, Ada!"`, status is `"SUCCESS"`, and notifications list is empty

#### Scenario: Multiple identical matching placeholders
- **WHEN** template is `"${name} and ${name}"` and variables map has `{ "name": "Ada" }`
- **THEN** the engine returns rendered text `"Ada and Ada"`, status is `"SUCCESS"`, and notifications list is empty

### Requirement: Handle null or missing placeholder values
The parsing engine SHALL NOT replace placeholders if the matching dictionary value is null, or if the key is missing entirely, and SHALL append a warning notification and flag the execution status.

#### Scenario: Null variable value prevents replacement
- **WHEN** template is `"Hello, ${name}!"` and variables map has `{ "name": null }`
- **THEN** the engine returns rendered text `"Hello, ${name}!"`, status is `"FAILED"`, and a WARNING notification with code `"NULL_VARIABLE_VALUE"` is generated

#### Scenario: Missing variable key in dictionary
- **WHEN** template is `"Hello, ${name}!"` and variables map is empty `{}`
- **THEN** the engine returns rendered text `"Hello, ${name}!"`, status is `"FAILED"`, and a WARNING notification with code `"MISSING_VARIABLE"` is generated

### Requirement: Handle partial parser success
The parsing engine SHALL flag the output status as `PARTIAL` if some placeholders are successfully replaced while others remain unresolved.

#### Scenario: Partial replacement of placeholders
- **WHEN** template is `"Hello ${name}, your age is ${age}"` and variables map has `{ "name": "Ada" }`
- **THEN** the engine returns rendered text `"Hello Ada, your age is ${age}"`, status is `"PARTIAL"`, and a WARNING notification with code `"MISSING_VARIABLE"` is generated for `${age}`

### Requirement: Identify unused dictionary variables
The parsing engine SHALL generate a warning notification if variables are provided in the dictionary but do not match any placeholder in the template.

#### Scenario: Unused dictionary entries
- **WHEN** template is `"Hello world!"` and variables map has `{ "unusedKey": "value" }`
- **THEN** the engine returns rendered text `"Hello world!"`, status is `"SUCCESS"`, and a WARNING notification with code `"UNUSED_VARIABLE"` is generated

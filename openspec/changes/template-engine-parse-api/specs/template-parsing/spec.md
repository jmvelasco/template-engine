## ADDED Requirements

### Requirement: Parse replaces placeholders with variable values
The TemplateEngine SHALL replace all occurrences of `${key}` placeholders in the template with the corresponding values from the variables dictionary, and return a `ParseResult` containing the processed text and a list of notifications.

#### Scenario: Empty template with empty dictionary
- **WHEN** `parse` is called with an empty string template and an empty dictionary
- **THEN** the result text SHALL be an empty string
- **THEN** the result SHALL contain an info notification indicating the template is empty

#### Scenario: Template without placeholders and empty dictionary
- **WHEN** `parse` is called with a template containing no `${...}` placeholders and an empty dictionary
- **THEN** the result text SHALL be the original template unchanged
- **THEN** the result SHALL contain an info notification indicating no placeholders were found

#### Scenario: Template without placeholders and non-empty dictionary
- **WHEN** `parse` is called with a template containing no `${...}` placeholders and a dictionary with entries
- **THEN** the result text SHALL be the original template unchanged
- **THEN** the result SHALL contain a warning notification for each dictionary key not found in the template

#### Scenario: Template with placeholders and empty dictionary
- **WHEN** `parse` is called with a template containing `${...}` placeholders and an empty dictionary
- **THEN** the result text SHALL be the original template unchanged (placeholders remain)
- **THEN** the result SHALL contain a warning notification for each unresolved placeholder

#### Scenario: Single placeholder with matching key
- **WHEN** `parse` is called with a template containing one `${name}` placeholder and a dictionary with key `name`
- **THEN** the result text SHALL have the placeholder replaced with the dictionary value
- **THEN** the result SHALL contain a success notification for the replacement

#### Scenario: Same placeholder appears multiple times
- **WHEN** `parse` is called with a template containing the same placeholder multiple times and a matching key
- **THEN** ALL occurrences of that placeholder SHALL be replaced
- **THEN** the result SHALL contain a single success notification for that key

#### Scenario: Multiple different placeholders all matched
- **WHEN** `parse` is called with a template containing multiple different placeholders and all keys are provided
- **THEN** all placeholders SHALL be replaced with their corresponding values
- **THEN** the result SHALL contain a success notification for each replacement
- **THEN** the status SHALL be `success`

### Requirement: Parse handles partial replacements
The TemplateEngine SHALL support partial replacements where some placeholders match dictionary keys and others do not, producing appropriate notifications for each case.

#### Scenario: Some placeholders matched, some unresolved
- **WHEN** `parse` is called with placeholders `${name}` and `${age}` but only `name` is in the dictionary
- **THEN** `${name}` SHALL be replaced and `${age}` SHALL remain as-is
- **THEN** the result SHALL contain a success notification for `name` and a warning for `${age}`
- **THEN** the status SHALL be `partial`

#### Scenario: Dictionary contains keys not present in template
- **WHEN** `parse` is called with a dictionary containing keys that do not match any placeholder in the template
- **THEN** the result text SHALL be unchanged for those keys
- **THEN** the result SHALL contain a warning notification for each unused key

#### Scenario: Variable with null value
- **WHEN** `parse` is called with a dictionary entry whose value is `null`
- **THEN** the corresponding placeholder SHALL NOT be replaced
- **THEN** the result SHALL contain a warning notification indicating the key has a null value

### Requirement: Parse handles escaped placeholders
The TemplateEngine SHALL recognize `\${key}` as an escaped placeholder and preserve it as the literal text `${key}` without attempting replacement.

#### Scenario: Escaped placeholder is preserved as literal
- **WHEN** `parse` is called with a template containing `\${name}` and a dictionary with key `name`
- **THEN** `\${name}` SHALL be converted to the literal text `${name}` (backslash removed, no replacement)
- **THEN** the result SHALL contain an info notification about the escaped placeholder

#### Scenario: Mix of escaped and regular placeholders
- **WHEN** `parse` is called with both `\${escaped}` and `${regular}` in the template
- **THEN** `\${escaped}` SHALL become literal `${escaped}` and `${regular}` SHALL be replaced normally

### Requirement: Parse handles values containing placeholder syntax
The TemplateEngine SHALL treat variable values containing `${...}` syntax as literal text and not resolve them recursively.

#### Scenario: Value contains placeholder syntax
- **WHEN** `parse` is called with `{ name: "${greeting} World" }`
- **THEN** the value SHALL be inserted literally as `${greeting} World`
- **THEN** the result SHALL contain a warning notification about the value containing placeholder syntax

### Requirement: Parse ignores malformed placeholders
The TemplateEngine SHALL NOT recognize malformed placeholder patterns as valid placeholders.

#### Scenario: Empty placeholder
- **WHEN** a template contains `${}`
- **THEN** it SHALL be left as-is (not treated as a placeholder)

#### Scenario: Placeholder with only whitespace
- **WHEN** a template contains `${ }` or `${ name }`
- **THEN** it SHALL be left as-is (not treated as a placeholder)

### Requirement: Parse does not mutate inputs
The TemplateEngine SHALL NOT modify the template string or the variables dictionary passed as arguments.

#### Scenario: Dictionary remains unchanged after parse
- **WHEN** `parse` is called with a dictionary containing entries
- **THEN** the original dictionary object SHALL have the same keys and values after the call

### Requirement: ParseResult provides derived status
The `ParseResult` SHALL expose a `status()` method that derives the overall processing status from the collected notifications.

#### Scenario: All placeholders replaced successfully
- **WHEN** all notifications are of type `success` (with optional `info`)
- **THEN** status SHALL return `success`

#### Scenario: Mix of successes and warnings
- **WHEN** notifications include both `success` and `warning` types
- **THEN** status SHALL return `partial`

#### Scenario: Only warnings or info, no successes
- **WHEN** notifications contain only `warning` or `info` types, no `success`
- **THEN** status SHALL return `warning`

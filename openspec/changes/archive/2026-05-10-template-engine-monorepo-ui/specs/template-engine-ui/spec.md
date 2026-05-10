## ADDED Requirements

### Requirement: Interactive variables table
The user interface SHALL provide a dynamic, editable table where users can add, edit, and remove custom key-value variables for the dictionary.

#### Scenario: User adds a new variable row
- **WHEN** the user clicks the "Add Variable" button
- **THEN** a new row with an empty "Key" input and an empty "Value" input is appended to the variables table

#### Scenario: User removes an existing variable row
- **WHEN** the user clicks the "Remove" button next to a specific variable row
- **THEN** that variable row is deleted from the table and is excluded from the final dictionary payload

### Requirement: Template input and parsing submission
The user interface SHALL allow users to enter a template string in a textarea and submit it alongside the compiled variables dictionary for server-side parsing.

#### Scenario: Submitting template and variables
- **WHEN** the user inputs a template and clicks the "Parse Template" button
- **THEN** a POST request containing the template string and variables dictionary is sent to the backend endpoint, and a loading state is shown

### Requirement: Detailed result and notifier console presentation
The user interface SHALL render the returned text, a visual status badge indicating whether parsing succeeded, failed, or was partially successful, and a dedicated logs console for notifier notifications.

#### Scenario: Render results with status badge
- **WHEN** the backend returns a successful parsing result with status "SUCCESS"
- **THEN** the UI renders the output string in a high-contrast container and displays a green "SUCCESS" badge

#### Scenario: Display parsing notifications console
- **WHEN** the parsing result contains one or more notifications (e.g., unused variable or missing placeholder)
- **THEN** those events are rendered inside a color-coded "System Logs" terminal console showing their severity level, code, and message

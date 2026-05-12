## ADDED Requirements

### Requirement: POST /parse endpoint accepts template and variables
The REST API SHALL expose a `POST /parse` endpoint that receives a JSON body with `template` (string) and `variables` (object) and returns the parse result.

#### Scenario: Successful parse request
- **WHEN** a POST request is sent to `/parse` with `{ "template": "Hello ${name}!", "variables": { "name": "John" } }`
- **THEN** the response status SHALL be 200
- **THEN** the response body SHALL contain `text`, `status`, and `notifications` fields
- **THEN** `text` SHALL be `"Hello John!"`
- **THEN** `status` SHALL be `"success"`

#### Scenario: Partial parse request
- **WHEN** a POST request is sent with placeholders that have no matching variables
- **THEN** the response status SHALL be 200
- **THEN** `status` SHALL reflect the partial processing state

#### Scenario: Empty template request
- **WHEN** a POST request is sent with an empty template string
- **THEN** the response status SHALL be 200
- **THEN** `text` SHALL be an empty string
- **THEN** `notifications` SHALL contain informational messages

### Requirement: POST /parse validates request body
The API SHALL validate the request body and return appropriate error responses for invalid input.

#### Scenario: Missing template field
- **WHEN** a POST request is sent without a `template` field
- **THEN** the response status SHALL be 400
- **THEN** the response body SHALL contain an error message indicating `template` is required

#### Scenario: Missing variables field
- **WHEN** a POST request is sent without a `variables` field
- **THEN** the response status SHALL be 400
- **THEN** the response body SHALL contain an error message indicating `variables` is required

#### Scenario: Invalid JSON body
- **WHEN** a POST request is sent with malformed JSON
- **THEN** the response status SHALL be 400

#### Scenario: Template is not a string
- **WHEN** a POST request is sent with `template` as a non-string value
- **THEN** the response status SHALL be 400

#### Scenario: Variables is not an object
- **WHEN** a POST request is sent with `variables` as a non-object value (array, string, number)
- **THEN** the response status SHALL be 400

### Requirement: API supports CORS
The API SHALL include CORS headers to allow requests from the web frontend development server.

#### Scenario: Preflight request
- **WHEN** an OPTIONS request is sent to `/parse`
- **THEN** the response SHALL include appropriate CORS headers

#### Scenario: Cross-origin POST request
- **WHEN** a POST request is sent from a different origin
- **THEN** the response SHALL include `Access-Control-Allow-Origin` header

### Requirement: API response follows consistent format
The API SHALL return responses in a consistent JSON format for both success and error cases.

#### Scenario: Success response format
- **WHEN** a valid parse request is processed
- **THEN** the response SHALL have the shape `{ text: string, status: string, notifications: Array<{ type: string, message: string }> }`

#### Scenario: Error response format
- **WHEN** an invalid request is received
- **THEN** the response SHALL have the shape `{ error: string }`

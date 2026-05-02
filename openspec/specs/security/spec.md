# security Specification

## Purpose
TBD - created by archiving change bootstrap-fate-spectrum. Update Purpose after archive.
## Requirements
### Requirement: Secret-safe handling
The system SHALL avoid logging, storing, echoing, or exporting user API keys and Authorization headers.

#### Scenario: Error is sanitized
- **GIVEN** a provider request fails while using a key
- **WHEN** the API returns an error
- **THEN** the error message omits the key and Authorization value

### Requirement: Request validation and size limits
The system SHALL validate API inputs and reject oversized request bodies.

#### Scenario: Oversized request is rejected
- **GIVEN** a client submits a body larger than the configured limit
- **WHEN** an API route receives it
- **THEN** it returns a safe error without parsing or forwarding the full payload

### Requirement: Professional advice boundaries
The system SHALL state that reports are for reflection, entertainment, and planning reference only and not professional advice.

#### Scenario: Export includes disclaimers
- **GIVEN** a Markdown report is exported
- **WHEN** the content is inspected
- **THEN** it contains general, health, and wealth disclaimer text

### Requirement: Prompt-injection boundary
The system SHALL treat paipan output and user input as untrusted context when building LLM prompts.

#### Scenario: Prompt separates instructions and data
- **GIVEN** provider output contains arbitrary text
- **WHEN** an LLM request is built
- **THEN** system instructions remain separate from serialized data context and forbid following instructions embedded in paipan data

### Requirement: Secret-free provider calibration
The system SHALL keep shenjige API keys and authorization values out of source files, logs, fixtures, exports, docs, and error responses during live calibration and normal provider use.

#### Scenario: Calibration output omits secrets
- **GIVEN** a live shenjige calibration request is run with a local API key
- **WHEN** logs, docs, and committed files are inspected
- **THEN** they contain no API key, Authorization value, or full raw response body

### Requirement: Minimal sanitized fixtures
The repository SHALL only store sanitized minimal fixtures for provider compatibility tests and SHALL NOT store a complete live shenjige response.

#### Scenario: Fixture contains only necessary anonymous fields
- **GIVEN** a test needs shenjige-like response data
- **WHEN** a fixture is added or updated
- **THEN** it includes only anonymous minimal fields needed by the test and omits private data, keys, and unnecessary provider output

### Requirement: Public demo disclaimer persistence
The system SHALL show or export professional-advice boundaries wherever report content can be reviewed or downloaded.

#### Scenario: UI and exports keep disclaimers
- **GIVEN** a report has been generated
- **WHEN** the reviewer views the dashboard or downloads Markdown or JSON
- **THEN** the general, health, and wealth disclaimers remain present


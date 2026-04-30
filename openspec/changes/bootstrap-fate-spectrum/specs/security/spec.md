## ADDED Requirements

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

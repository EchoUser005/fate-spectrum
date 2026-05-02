## ADDED Requirements

### Requirement: Session-only key cache
The system SHALL cache user-entered LLM keys only in browser session storage and SHALL NOT persist keys to backend storage, local storage, exports, logs, or fixtures.

#### Scenario: Key is restored within the browser session
- **GIVEN** the user enters an LLM API key and keeps session caching enabled
- **WHEN** they refresh the page in the same browser session
- **THEN** the key is restored from session storage and remains absent from exported report artifacts

### Requirement: Clear cached key action
The dashboard SHALL provide a clear action to remove cached LLM key/config values from browser session storage.

#### Scenario: User clears cached key
- **GIVEN** an LLM key has been cached in session storage
- **WHEN** the user activates the clear cached key action
- **THEN** the key field is cleared and the session storage entry is removed

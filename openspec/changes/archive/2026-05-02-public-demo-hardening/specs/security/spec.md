## ADDED Requirements

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

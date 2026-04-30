# report-generation Specification

## Purpose
TBD - created by archiving change bootstrap-fate-spectrum. Update Purpose after archive.
## Requirements
### Requirement: Generate complete report without LLM
The system SHALL generate a complete report from valid birth input and mock paipan data even when no LLM key is provided.

#### Scenario: Mock report with rule narrative
- **GIVEN** valid birth input and Mock Demo provider selection
- **WHEN** the user requests a report without an LLM key
- **THEN** the response includes metadata, birth data, normalized paipan, dimensions, dayun scores, yearly scores, rule-based narratives, and raw paipan JSON

### Requirement: Preserve raw and normalized paipan
The system SHALL return both raw paipan JSON and a normalized representation for dashboard and export use.

#### Scenario: Raw JSON is inspectable
- **GIVEN** a paipan provider returns a valid response
- **WHEN** the report is generated
- **THEN** the report contains the original provider response and normalized pillars, palaces, dayun windows, and output text

### Requirement: Typed API contracts
The system SHALL validate report generation request and response data with schemas.

#### Scenario: Invalid report input is rejected
- **GIVEN** an API client submits an invalid birth date or provider value
- **WHEN** the report endpoint receives the request
- **THEN** it returns a typed validation error without calling external providers


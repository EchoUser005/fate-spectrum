# export Specification

## Purpose
TBD - created by archiving change bootstrap-fate-spectrum. Update Purpose after archive.
## Requirements
### Requirement: JSON export helper
The system MAY keep a secret-safe JSON export helper for tests or developer tooling, but the ordinary product UI SHALL NOT present raw/source JSON as a primary report action.

#### Scenario: JSON helper omits secrets
- **GIVEN** a report has been generated
- **WHEN** JSON export helper output is prepared
- **THEN** the JSON data contains no hidden secrets

### Requirement: Markdown export
The system SHALL allow users to export a Markdown life spectrum report containing key sections and disclaimers.

#### Scenario: Markdown contains report sections
- **GIVEN** a report has been generated
- **WHEN** the user activates Markdown export
- **THEN** the Markdown includes title, basic information, pillars, Ziwei summary, dayun scores, key windows, dimension explanations, action plan, disclaimers, generated time, and engine version

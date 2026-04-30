## ADDED Requirements

### Requirement: JSON export
The system SHALL allow users to export the generated report as JSON.

#### Scenario: JSON export is available
- **GIVEN** a report has been generated
- **WHEN** the user activates JSON export
- **THEN** a JSON file containing the report data is downloaded or prepared without hidden secrets

### Requirement: Markdown export
The system SHALL allow users to export a Markdown life spectrum report containing key sections and disclaimers.

#### Scenario: Markdown contains report sections
- **GIVEN** a report has been generated
- **WHEN** the user activates Markdown export
- **THEN** the Markdown includes title, basic information, pillars, Ziwei summary, dayun scores, key windows, dimension explanations, action plan, disclaimers, generated time, and engine version

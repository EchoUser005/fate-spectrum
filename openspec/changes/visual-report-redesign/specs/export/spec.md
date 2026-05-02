## ADDED Requirements

### Requirement: Markdown export is product-facing
Markdown export SHALL include the readable report sections, target dayun scores, summaries, and disclaimers while avoiding technical terms in the main body.

#### Scenario: Markdown avoids technical copy
- **GIVEN** a report has been generated
- **WHEN** Markdown export is created
- **THEN** the main exported content includes dimensions, dayun scores, yearly focus, action notes, and disclaimers without Provider, Paipan, LLM, BYOK, endpoint, JSON, raw, normalize, schema, or engine terms

### Requirement: Developer appendix is separated
If technical export details are included, they SHALL be placed in an explicit developer appendix that is not part of the default ordinary report.

#### Scenario: Default export has no developer appendix
- **GIVEN** the user activates the ordinary Markdown export
- **WHEN** the content is inspected
- **THEN** no raw provider response, model request summary, API key, or endpoint value appears in the Markdown

### Requirement: Export buttons remain reachable
The dashboard SHALL keep Markdown and JSON export actions visible after report generation on desktop, tablet, and mobile.

#### Scenario: Mobile export controls are visible
- **GIVEN** a report is generated on a 390x844 viewport
- **WHEN** the user scrolls to the export area
- **THEN** Markdown and JSON export actions are visible and tappable without horizontal page overflow

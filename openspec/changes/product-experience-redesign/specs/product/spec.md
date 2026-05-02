## ADDED Requirements

### Requirement: Outcome-first product framing
The system SHALL present Fate Spectrum as a user-facing insight product that prioritizes life rhythm, windows, trade-offs, and actions over raw paipan source material.

#### Scenario: User scans product value first
- **GIVEN** a public-demo user opens the homepage or a generated report
- **WHEN** they scan headings and primary sections
- **THEN** they first see user outcomes such as current profile, next windows, opportunity/risk balance, and action guidance rather than raw JSON or provider mechanics

### Requirement: Source data is advanced context
The system SHALL keep BaZi, Ziwei, provider, and raw JSON details available as optional source context without making them the primary product experience.

#### Scenario: Advanced user inspects source data
- **GIVEN** a report has been generated
- **WHEN** the user opens the advanced/source data section
- **THEN** BaZi pillars, Ziwei palace grid, and raw paipan JSON are available without dominating the default report hierarchy

## ADDED Requirements

### Requirement: Rule-based numeric scoring
The system SHALL compute all numeric scores with deterministic rules and SHALL NOT use LLM output as the source of score values.

#### Scenario: Same paipan produces stable scores
- **GIVEN** the same normalized paipan and birth input
- **WHEN** the scoring engine runs multiple times
- **THEN** each dayun and yearly dimension score remains the same for the same engine version

### Requirement: Seven spectrum dimensions
The system SHALL score wealth, career, comfort, selfValue, relationship, healthEnergy, and riskControl from 0 to 100 with 50 as neutral.

#### Scenario: Report includes all dimensions
- **GIVEN** a report is generated
- **WHEN** the response is inspected
- **THEN** every dayun and yearly score includes the seven configured dimensions and no single total score is required

### Requirement: Explain scoring signals
The system SHALL produce rule-based explanation text for each dimension and key scoring window.

#### Scenario: LLM disabled explanations
- **GIVEN** LLM narrative generation is disabled
- **WHEN** a report is generated
- **THEN** each dimension still has an explanation and action plan derived from deterministic scoring signals

### Requirement: Tolerate incomplete paipan arrays
The system SHALL handle mismatched dayunGZ, dayunAge, and dayunYear arrays without throwing.

#### Scenario: Dayun arrays have different lengths
- **GIVEN** paipan data has dayun arrays with inconsistent lengths
- **WHEN** normalization and scoring run
- **THEN** the report contains usable dayun rows with missing values filled by safe defaults or omitted fields

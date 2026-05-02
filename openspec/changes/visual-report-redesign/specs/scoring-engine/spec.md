## ADDED Requirements

### Requirement: Sample paipan golden profile
The scoring engine SHALL apply a golden profile for the sample paipan when normalized pillars are `己卯 / 乙亥 / 戊寅 / 癸亥` and the dayun sequence contains `丙子`, `丁丑`, `戊寅`, `己卯`, `庚辰`, `辛巳`, `壬午`, and `癸未`.

#### Scenario: Sample output matches target scores
- **GIVEN** the sample paipan fixture normalizes to the golden pillars and dayun sequence
- **WHEN** the scoring engine builds a report
- **THEN** all eight dayun rows exactly match the target wealth, career, comfort, selfValue, relationship, healthEnergy, riskControl, and summary values defined by the golden profile

### Requirement: Golden profile remains traceable
The system SHALL make the golden profile explicit, testable, and documented as an MVP demo regression rather than a hidden universal scoring rule.

#### Scenario: Golden rule is narrow
- **GIVEN** a non-sample paipan does not match the golden pillars and dayun sequence
- **WHEN** the scoring engine runs
- **THEN** the general rule-based scoring engine is used instead of the sample golden override

### Requirement: LLM cannot alter scores
The scoring engine SHALL preserve identical numeric dayun and yearly scores whether LLM narrative is disabled or enabled.

#### Scenario: Narrative override keeps scores fixed
- **GIVEN** the same birth input and paipan data
- **WHEN** one report is built with rule narrative and another is built with narrative override
- **THEN** dayunScores and yearlyScores remain identical in both reports

### Requirement: Dimension scores are not a single fate score
The scoring engine SHALL represent the report as seven dimension scores and SHALL NOT generate a primary single total fate score.

#### Scenario: Dimension口径 is explicit
- **GIVEN** a report has been generated
- **WHEN** the user or export reads scores
- **THEN** scores are grouped by the seven named dimensions with explanatory summaries instead of one total judgement number

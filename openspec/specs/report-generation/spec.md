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

### Requirement: Stage-tracked report pipeline
The system SHALL expose clear report generation stages for validation, paipan retrieval, paipan normalization, spectrum scoring, narrative generation, and result rendering.

#### Scenario: User sees generation stages
- **GIVEN** the user starts report generation
- **WHEN** the report request is in progress or completes
- **THEN** the UI can show the stages 校验输入, 获取排盘, 归一化排盘, 计算光谱分数, 生成解释, and 渲染结果 without exposing secrets

### Requirement: Dimension-first report output
The system SHALL keep report output focused on named dimensions and SHALL NOT present a single total fate score as the primary result.

#### Scenario: Report explains dimensions instead of one total
- **GIVEN** a report is generated
- **WHEN** the user inspects the result
- **THEN** the report prominently explains each spectrum dimension and does not rely on a single overall score

### Requirement: LLM explanation-only fallback
The system SHALL generate complete reports from paipan data and rule-based scores when no LLM key is provided, and SHALL use LLM output only for explanatory text when enabled.

#### Scenario: No real paipan endpoint uses sample chart instead of LLM paipan
- **GIVEN** the user has no real paipan endpoint but enables or configures an LLM provider
- **WHEN** they run the public demo
- **THEN** the app uses the sample chart for paipan data and only asks the LLM to explain existing paipan and score data if a valid LLM key is supplied

### Requirement: Export disclaimer coverage
The system SHALL include the general, health, and wealth disclaimers in both Markdown and JSON report exports.

#### Scenario: Exported report contains disclaimers
- **GIVEN** a report is generated
- **WHEN** the user exports Markdown or JSON
- **THEN** the exported artifact includes the professional-advice, health non-diagnosis, and wealth non-investment disclaimer text


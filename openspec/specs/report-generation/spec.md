# report-generation Specification

## Purpose
TBD - created by archiving change bootstrap-fate-spectrum. Update Purpose after archive.
## Requirements
### Requirement: Generate complete report without LLM
The system SHALL generate a complete report from valid birth input and calibrated internal paipan data even when no model key is provided.

#### Scenario: Report with rule narrative
- **GIVEN** valid birth input
- **WHEN** the user requests a report without a model key
- **THEN** the response includes metadata, birth data, normalized chart data, dimensions, dayun scores, yearly scores, and rule-based narratives

### Requirement: Preserve source data internally
The system SHALL preserve source paipan data and a normalized representation internally for scoring and compatibility tests while omitting source data from the ordinary product report UI.

#### Scenario: Source data supports scoring
- **GIVEN** a paipan provider returns a valid response
- **WHEN** the report is generated
- **THEN** scoring receives the original provider response and normalized pillars, palaces, dayun windows, and output text without requiring the UI to render raw source data

### Requirement: Typed API contracts
The system SHALL validate report generation request and response data with schemas.

#### Scenario: Invalid report input is rejected
- **GIVEN** an API client submits an invalid birth date or provider value
- **WHEN** the report endpoint receives the request
- **THEN** it returns a typed validation error without calling external providers

### Requirement: Stage-tracked report pipeline
The system SHALL expose concise product-facing report generation phases instead of internal pipeline names.

#### Scenario: User sees generation stages
- **GIVEN** the user starts report generation
- **WHEN** the report request is in progress or completes
- **THEN** the UI can show 正在排盘, 正在计算维度, 正在生成报告, and 正在绘制图表 without exposing secrets

### Requirement: Dimension-first report output
The system SHALL keep report output focused on named dimensions and SHALL NOT present a single total fate score as the primary result.

#### Scenario: Report explains dimensions instead of one total
- **GIVEN** a report is generated
- **WHEN** the user inspects the result
- **THEN** the report prominently explains each spectrum dimension and does not rely on a single overall score

### Requirement: LLM explanation-only fallback
The system SHALL generate complete reports from paipan data and rule-based scores when no LLM key is provided, and SHALL use LLM output only for explanatory text when enabled.

#### Scenario: No real paipan endpoint uses internal chart instead of model paipan
- **GIVEN** the user has no real paipan endpoint but enables or configures a model provider
- **WHEN** they run the public report
- **THEN** the app uses calibrated internal chart data and only asks the model to explain existing chart and score data if a valid model key is supplied

### Requirement: Export disclaimer coverage
The system SHALL include the general, health, and wealth disclaimers in both Markdown and JSON report exports.

#### Scenario: Exported report contains disclaimers
- **GIVEN** a report is generated
- **WHEN** the user exports Markdown or JSON
- **THEN** the exported artifact includes the professional-advice, health non-diagnosis, and wealth non-investment disclaimer text

# report-generation Specification

## Purpose
TBD - created by archiving change bootstrap-fate-spectrum. Update Purpose after archive.
## Requirements
### Requirement: Generate interpreted report with model key
The system SHALL generate a complete interpreted report from valid birth input, real paipan data, deterministic scores, and a configured model key.

#### Scenario: Report with model narrative
- **GIVEN** valid birth input and a model key
- **WHEN** the user requests a report
- **THEN** the response includes metadata, birth data, normalized chart data, dimensions, dayun scores, yearly scores, and model-generated narrative that does not alter scores

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

#### Scenario: Model never substitutes for paipan
- **GIVEN** the user configures a model provider
- **WHEN** they run the public report
- **THEN** the app obtains paipan data from the paipan provider and only asks the model to explain existing chart and score data

### Requirement: Export disclaimer coverage
The system SHALL include the general, health, and wealth disclaimers in Markdown report exports and any JSON helper output.

#### Scenario: Exported report contains disclaimers
- **GIVEN** a report is generated
- **WHEN** Markdown export or JSON helper output is created
- **THEN** the exported artifact includes the professional-advice, health non-diagnosis, and wealth non-investment disclaimer text

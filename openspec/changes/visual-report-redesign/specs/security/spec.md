## ADDED Requirements

### Requirement: Public UI does not reveal internal data source names
The ordinary user interface SHALL hide internal provider names and implementation-source details.

#### Scenario: Data source stays generic
- **GIVEN** the user uses the report workbench
- **WHEN** they inspect the ordinary wizard and report surfaces
- **THEN** the UI does not expose shenjige, provider, endpoint, form mapping details, 使用样例体验, or 使用真实排盘

### Requirement: API keys remain session-only and hidden from exports
The system SHALL keep model keys in browser session convenience storage only and SHALL NOT include keys in backend responses, logs, report output, screenshots, or exports.

#### Scenario: Export omits model key
- **GIVEN** the user enters a model key and generates a report
- **WHEN** JSON or Markdown export is created
- **THEN** the exported content contains no key, Authorization value, or session-storage value

### Requirement: Product UI has no advanced data action
Raw provider response, normalized data, and model request summaries SHALL NOT have a visible product UI disclosure.

#### Scenario: Developer data is absent from report UI
- **GIVEN** a report is generated
- **WHEN** the user scans report navigation, report sections, and export controls
- **THEN** raw response text, technical diagnostics, 原始排盘 JSON, and 高级数据 are not visible

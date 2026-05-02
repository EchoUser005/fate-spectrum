## ADDED Requirements

### Requirement: Public UI does not reveal internal data source names
The ordinary user interface SHALL hide internal provider names and implementation-source details unless the user opens Advanced Settings or Developer Data.

#### Scenario: Data source stays generic
- **GIVEN** the user uses the default sample flow or the real data-source flow
- **WHEN** they inspect the ordinary wizard and report surfaces
- **THEN** the UI says 使用样例体验 or 使用真实排盘 instead of exposing shenjige, provider, endpoint, or form mapping details

### Requirement: API keys remain session-only and hidden from exports
The system SHALL keep model keys in browser session convenience storage only and SHALL NOT include keys in backend responses, logs, report output, screenshots, or exports.

#### Scenario: Export omits model key
- **GIVEN** the user enters a model key and generates a report
- **WHEN** JSON or Markdown export is created
- **THEN** the exported content contains no key, Authorization value, or session-storage value

### Requirement: Advanced data is explicit user action
Raw provider response, normalized data, and model request summaries SHALL be closed by default and require explicit user action to view.

#### Scenario: Developer data requires expansion
- **GIVEN** a report is generated
- **WHEN** the user has not expanded 高级数据
- **THEN** raw response text and technical diagnostics are not visible, and expanding 高级数据 reveals a warning that the section is for debugging and collaboration

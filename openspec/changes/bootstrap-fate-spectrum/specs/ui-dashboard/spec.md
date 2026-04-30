## ADDED Requirements

### Requirement: Chinese-first spectrum dashboard
The system SHALL provide a Chinese-first dashboard for entering birth data, selecting providers, generating reports, and viewing spectrum visualizations.

#### Scenario: User generates mock report
- **GIVEN** the user fills valid birth input and selects Mock Demo
- **WHEN** they click the generate action
- **THEN** the page shows generation status and renders the complete life spectrum report

### Requirement: Required report sections
The dashboard SHALL display summary, BaZi pillars, Ziwei palace grid, dimension cards, dayun spectrum table, line chart, heatmap, yearly color scale table, raw JSON, and export actions.

#### Scenario: Report sections are visible
- **GIVEN** a report has been generated
- **WHEN** the dashboard renders
- **THEN** the user can inspect 八字四柱, 星盘宫格, 多维度能量谱, 大运光谱, 光谱曲线, 色阶图, 流年色阶, 原始排盘 JSON, and export buttons

### Requirement: Input status feedback
The dashboard SHALL communicate validation, paipan fetching, normalization, scoring, narrative generation, and rendering states during report generation.

#### Scenario: Generation status changes
- **GIVEN** the user starts report generation
- **WHEN** the request is in progress
- **THEN** the status area shows the current generation steps without exposing secrets

### Requirement: Required disclaimers
The dashboard SHALL display general, health, and wealth disclaimers near report output.

#### Scenario: Disclaimers shown
- **GIVEN** a report is visible
- **WHEN** the user reviews the page
- **THEN** the general disclaimer, health non-diagnosis notice, and wealth non-investment notice are displayed

# ui-dashboard Specification

## Purpose
TBD - created by archiving change bootstrap-fate-spectrum. Update Purpose after archive.
## Requirements
### Requirement: Chinese-first spectrum dashboard
The system SHALL provide a Chinese-first dashboard for entering birth data, configuring the model, generating reports, and viewing spectrum visualizations.

#### Scenario: User generates mock report
- **GIVEN** the user fills valid birth input and model configuration
- **WHEN** they click the generate action
- **THEN** the page shows concise generation progress and renders the complete life spectrum report

### Requirement: Required report sections
The dashboard SHALL display summary, BaZi pillars, Ziwei palace grid, dimension cards, dayun spectrum table, line chart, heatmap, yearly color scale table, and export actions.

#### Scenario: Report sections are visible
- **GIVEN** a report has been generated
- **WHEN** the dashboard renders
- **THEN** the user can inspect 八字四柱, 星盘宫格, 多维度能量谱, 大运光谱, 光谱曲线, 色阶图, 流年色阶, and export buttons

### Requirement: Input status feedback
The dashboard SHALL communicate report generation through concise product phases.

#### Scenario: Generation status changes
- **GIVEN** the user starts report generation
- **WHEN** the request is in progress
- **THEN** the status area shows 正在排盘, 正在计算维度, 正在生成报告, and 正在绘制图表 without exposing secrets or internal pipeline names

### Requirement: Required disclaimers
The dashboard SHALL display general, health, and wealth disclaimers near report output.

#### Scenario: Disclaimers shown
- **GIVEN** a report is visible
- **WHEN** the user reviews the page
- **THEN** the general disclaimer, health non-diagnosis notice, and wealth non-investment notice are displayed

### Requirement: No paipan key required for public report generation
The dashboard SHALL allow a public reviewer to generate a report without entering a paipan API key.

#### Scenario: Reviewer runs report without key
- **GIVEN** a reviewer fills valid birth fields
- **WHEN** they click the primary generate action
- **THEN** the app generates and renders a life spectrum report without asking for any paipan API key

### Requirement: Internal data source hidden from ordinary UI
The dashboard SHALL avoid presenting provider names, endpoint details, or raw source data as ordinary product content.

#### Scenario: User sees product language
- **GIVEN** the user opens the workbench and generated report
- **WHEN** they scan visible labels and notices
- **THEN** they see product report language instead of Provider, Paipan, shenjige, endpoint, Raw JSON, or LLM labels

### Requirement: Spectrum product language retention
The dashboard SHALL retain the Fate Spectrum product vocabulary throughout report sections and avoid single-total-score framing.

#### Scenario: Report sections use spectrum language
- **GIVEN** a report is visible
- **WHEN** the reviewer scans headings and export controls
- **THEN** they can find 多维度能量谱, 大运光谱, 流年色阶, 光谱曲线, 色阶图, and 星盘宫格 as inspectable sections

### Requirement: Responsive public demo layout
The dashboard SHALL keep the homepage and report page usable on mobile and desktop without overlapping controls, unreadable text, or hidden critical actions.

#### Scenario: Mobile report remains usable
- **GIVEN** a reviewer opens the app on a narrow mobile viewport
- **WHEN** they generate and inspect a report
- **THEN** model configuration, generation progress, dimension explanations, charts, exports, and disclaimers remain readable and reachable

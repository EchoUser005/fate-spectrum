# ui-dashboard Specification

## Purpose
TBD - created by archiving change bootstrap-fate-spectrum. Update Purpose after archive.
## Requirements
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

### Requirement: One-click Mock Demo
The dashboard SHALL allow a public reviewer to generate a Mock Demo report with the default sample input and no API key.

#### Scenario: Reviewer runs Mock Demo without key
- **GIVEN** a reviewer opens the homepage with the default Mock Demo provider
- **WHEN** they click the primary generate action
- **THEN** the app generates and renders a sample life spectrum report without asking for any API key

### Requirement: Provider responsibility copy
The dashboard SHALL clearly state that DeepSeek and OpenAI-compatible providers only explain existing paipan and scores, and that shenjige has MVP limitations.

#### Scenario: Provider limitations are visible before generation
- **GIVEN** the user is choosing provider options
- **WHEN** they view LLM and shenjige configuration areas
- **THEN** they can see that LLMs do not calculate paipan, sample charts are used without a real paipan endpoint, and shenjige currently supports only solar calendar, male/female gender, no overseas timezone conversion, and true-solar-time prompt preservation

### Requirement: Spectrum product language retention
The dashboard SHALL retain the Fate Spectrum product vocabulary throughout report sections and avoid single-total-score framing.

#### Scenario: Report sections use spectrum language
- **GIVEN** a report is visible
- **WHEN** the reviewer scans headings and export controls
- **THEN** they can find 多维度能量谱, 大运光谱, 流年色阶, 光谱曲线, 色阶图, 星盘宫格, and 原始排盘 JSON as inspectable sections

### Requirement: Responsive public demo layout
The dashboard SHALL keep the homepage and report page usable on mobile and desktop without overlapping controls, unreadable text, or hidden critical actions.

#### Scenario: Mobile report remains usable
- **GIVEN** a reviewer opens the app on a narrow mobile viewport
- **WHEN** they generate and inspect a Mock Demo report
- **THEN** provider guidance, generation stages, dimension explanations, charts, exports, and disclaimers remain readable and reachable


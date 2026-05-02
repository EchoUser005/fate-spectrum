## ADDED Requirements

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

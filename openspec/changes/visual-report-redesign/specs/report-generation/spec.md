## ADDED Requirements

### Requirement: User-facing generation phases
The system SHALL expose ordinary generation phases as 正在排盘, 正在计算维度, 正在生成报告, and 正在绘制图表.

#### Scenario: Progress avoids internal pipeline names
- **GIVEN** the user starts report generation
- **WHEN** progress is displayed
- **THEN** the visible progress labels use the four ordinary phases and do not expose validation, fetch, normalization, scoring engine, LLM, or rendering internals

### Requirement: Report centers dimension scores and timing tables
The generated report SHALL prioritize 维度评分, 大运光谱, and 流年色阶 before long narratives or source data.

#### Scenario: Overview and dayun appear first
- **GIVEN** a report has been generated
- **WHEN** the user reaches the report first screen
- **THEN** they see chart summary, current cycle, three main signal cards, the dayun spectrum curve, and dayun color scale before raw data, model settings, or full yearly tables

### Requirement: Report avoids repeated score blocks
The generated report SHALL use charts for trend shape, heatmaps/tables for detailed numeric scores, and narrative cards for judgement text instead of repeating the same numeric scores in every section.

#### Scenario: Detailed reading is not another score table
- **GIVEN** a report has been generated
- **WHEN** the user scans overview and detailed reading cards
- **THEN** those cards show qualitative labels and interpretation text while numeric dayun details remain in the curve, color scale, and score table

### Requirement: Report omits raw data surface
The report SHALL NOT show raw provider JSON, normalized source data, model request summaries, or a 高级数据 section in the product UI.

#### Scenario: Developer data does not render
- **GIVEN** a report has been generated
- **WHEN** the user scans all report sections and navigation
- **THEN** raw provider JSON, normalized data, model request summaries, 原始排盘 JSON, and 高级数据 are not visible

### Requirement: Concise overview narrative
The report overview SHALL include a report-editor style summary of no more than 120 Chinese characters.

#### Scenario: Overview is short
- **GIVEN** a report has been generated
- **WHEN** the overview summary is rendered
- **THEN** it gives the main judgement in 120 Chinese characters or fewer and avoids system-reasoning language

### Requirement: Shared dayun score source
The dayun curve, dayun heatmap, and dayun score table SHALL all use the same `report.dayunScores` data source.

#### Scenario: Dayun visuals agree
- **GIVEN** a report has dayun score rows
- **WHEN** the chart, heatmap, and table data are built
- **THEN** every dayun label and every dimension score matches the corresponding `report.dayunScores` row

### Requirement: Dayun rows include score instructions
Each dayun score table row SHALL include precise opportunity, risk, and action instructions derived from the same score row.

#### Scenario: Every dayun row has operational judgement
- **GIVEN** a report contains eight dayun score rows
- **WHEN** the dayun score table renders
- **THEN** each row includes 大运, 年份, 年龄, seven dimension scores, 主判, 机会, 风险, and 行动

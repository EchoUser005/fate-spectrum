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

### Requirement: Default report hides raw data
The report SHALL NOT show raw provider JSON, normalized source data, or model request summaries unless the user opens 高级数据.

#### Scenario: Developer data closed by default
- **GIVEN** a report has been generated
- **WHEN** the report first renders
- **THEN** raw provider JSON, normalized data, and model request summaries are hidden behind a closed disclosure

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

## ADDED Requirements

### Requirement: Ordinary UI hides technical terminology
The dashboard SHALL keep ordinary user-facing landing, wizard, report navigation, overview, dayun, yearly, chart, and export surfaces free from technical implementation terms.

#### Scenario: Public report avoids engineering copy
- **GIVEN** a user opens the app and generates the sample report
- **WHEN** they inspect the landing, wizard, report sections, and export controls without opening advanced settings or developer data
- **THEN** they do not see Provider, Paipan, Mock Demo, Custom Paipan, shenjige, OpenAI-compatible, LLM, BYOK, JSON, OpenSpec, Zod, schema, raw, normalize, engine, prompt, endpoint, API route, report status, dimension spectrum, or birth input

### Requirement: Technical details are advanced-only
The dashboard SHALL keep provider endpoints, shenjige details, model service fields, API keys, raw response data, normalized data, and model request summaries inside Advanced Settings or Developer Data disclosures.

#### Scenario: Advanced disclosure contains technical fields
- **GIVEN** a user opens the generation wizard
- **WHEN** they expand Advanced Settings
- **THEN** endpoint, provider limitations, model service address, model name, key, and raw-data debug controls are available without appearing in the default wizard surface

### Requirement: Product-first landing
The dashboard SHALL render a product landing screen with the title `命运光谱`, the required subtitle, `开始生成`, `查看样例报告`, three benefits, and a compact sample-report preview.

#### Scenario: Landing looks like product entry
- **GIVEN** a first-time user opens the homepage
- **WHEN** the first viewport loads
- **THEN** the user sees `命运光谱`, the Chinese subtitle, the primary and secondary actions, and preview scores for 财富量级, 生活舒适度, and 自我价值成就 without seeing technical provider/model terms

### Requirement: Three-step generation wizard
The dashboard SHALL collect inputs through a three-step wizard: 生辰信息, 解读方式, and 生成报告.

#### Scenario: User advances through wizard
- **GIVEN** the user starts generation
- **WHEN** they move through the wizard
- **THEN** Step 1 shows birth fields, Step 2 shows 使用样例体验, 使用真实排盘, and optional 模型润色, and Step 3 shows the generate action and concise progress phases

### Requirement: Report section navigation
The dashboard SHALL show sticky report navigation after generation with 总览, 大运, 流年, 星盘, 详细解读, and 高级数据.

#### Scenario: User navigates report sections
- **GIVEN** a report has been generated
- **WHEN** the user activates each navigation item
- **THEN** the viewport moves to the corresponding report section and the navigation remains usable on desktop and mobile

### Requirement: Responsive visual report layout
The dashboard SHALL support 1440x1000 desktop, 768x1024 tablet, and 390x844 mobile viewports without page-level horizontal overflow.

#### Scenario: Mobile and tablet remain readable
- **GIVEN** the app is viewed at desktop, tablet, and mobile sizes
- **WHEN** the user generates a report and inspects charts, heatmaps, tables, nav, advanced data, and export buttons
- **THEN** main page content stays within the viewport, charts keep stable heights, and large heatmaps/tables scroll inside their own containers

### Requirement: Chart legends and dimension meanings
The dashboard SHALL display chart legends and concise dimension meanings wherever score charts or dimension cards appear.

#### Scenario: User understands chart colors
- **GIVEN** a report chart is visible
- **WHEN** the user scans the chart and nearby legend
- **THEN** each visible dimension has a Chinese label, a stable color, and a short meaning or tooltip explaining how to read the score

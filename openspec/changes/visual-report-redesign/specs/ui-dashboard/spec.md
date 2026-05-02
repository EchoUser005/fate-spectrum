## ADDED Requirements

### Requirement: Ordinary UI hides technical terminology
The dashboard SHALL keep ordinary user-facing landing, wizard, report navigation, overview, dayun, yearly, chart, and export surfaces free from technical implementation terms.

#### Scenario: Public report avoids engineering copy
- **GIVEN** a user opens the app and generates the sample report
- **WHEN** they inspect the workbench, report sections, and export controls
- **THEN** they do not see Provider, Paipan, Mock Demo, Custom Paipan, shenjige, OpenAI-compatible, LLM, BYOK, JSON, OpenSpec, Zod, schema, raw, normalize, engine, prompt, endpoint, API route, report status, dimension spectrum, or birth input

### Requirement: Technical details are not product UI
The dashboard SHALL keep provider endpoints, shenjige details, raw response data, normalized data, and model request summaries out of the ordinary product UI.

#### Scenario: Product workbench has no technical disclosure
- **GIVEN** a user opens the generation wizard
- **WHEN** they inspect every visible field and control
- **THEN** endpoint, provider limitations, raw-data debug controls, 高级设置, and 高级数据 are not visible

### Requirement: Single workbench first viewport
The dashboard SHALL render a single first-viewport workbench with the title `命运光谱`, 生辰配置, 模型配置, and `生成报告`.

#### Scenario: First viewport is directly usable
- **GIVEN** a first-time user opens the homepage
- **WHEN** the first viewport loads
- **THEN** the user can fill birth information, configure model mode/key, and generate the report without seeing sample-entry copy or numbered instructions

### Requirement: No numbered generation wizard
The dashboard SHALL NOT frame report generation as Step 1, Step 2, Step 3, or a sample/demo path.

#### Scenario: User sees direct configuration
- **GIVEN** the user starts generation
- **WHEN** they inspect the workbench
- **THEN** they see 生辰配置, 模型配置, and 生成报告 without Step, 第 1 步, 第 2 步, 第 3 步, 使用样例体验, 查看样例报告, or 可选

### Requirement: Report section navigation
The dashboard SHALL show sticky report navigation after generation with 总览, 大运, 流年, 星盘, and 详细解读.

#### Scenario: User navigates report sections
- **GIVEN** a report has been generated
- **WHEN** the user activates each navigation item
- **THEN** the viewport moves to the corresponding report section, the navigation remains usable on desktop and mobile, and 高级数据 is not shown

### Requirement: Responsive visual report layout
The dashboard SHALL support 1440x1000 desktop, 768x1024 tablet, and 390x844 mobile viewports without page-level horizontal overflow.

#### Scenario: Mobile and tablet remain readable
- **GIVEN** the app is viewed at desktop, tablet, and mobile sizes
- **WHEN** the user generates a report and inspects charts, heatmaps, tables, nav, and export buttons
- **THEN** main page content stays within the viewport, charts keep stable heights, and large heatmaps/tables scroll inside their own containers

### Requirement: Chart legends and dimension meanings
The dashboard SHALL display chart legends and concise dimension meanings wherever score charts or dimension cards appear.

#### Scenario: User understands chart colors
- **GIVEN** a report chart is visible
- **WHEN** the user scans the chart and nearby legend
- **THEN** each visible dimension has a Chinese label, a stable color, and a short meaning or tooltip explaining how to read the score

### Requirement: Single report workbench
The dashboard SHALL present birth configuration, model configuration, and the generate action as one compact workbench instead of a landing page, sample flow, or numbered wizard.

#### Scenario: User can operate without reading a manual
- **GIVEN** a user opens the product
- **WHEN** the first viewport renders
- **THEN** they see 生辰配置, 模型配置, and 生成报告 without 使用样例体验, 查看样例报告, Step, 第 1 步, 第 2 步, 第 3 步, or numbered wizard badges

### Requirement: No advanced data surface
The dashboard SHALL NOT display advanced settings, developer data, raw JSON, normalized data, or model request summaries in the ordinary product UI.

#### Scenario: Report has no developer drawer
- **GIVEN** a report has been generated
- **WHEN** the user scans all report sections
- **THEN** they do not see 高级设置, 高级数据, 原始排盘 JSON, 归一化数据, or 模型请求摘要

### Requirement: Report headings match table output
Report section headings SHALL be direct output labels instead of broad guidance copy.

#### Scenario: Dayun section uses exact report labels
- **GIVEN** a report has been generated
- **WHEN** the dayun section renders
- **THEN** it shows 大运维度评分曲线, 大运色阶图, and 大运评分表 without showing 先看这八步怎么起伏

## ADDED Requirements

### Requirement: DeepSeek quality modes stay outside the main surface
The dashboard SHALL expose DeepSeek modes as 快速, 高质量, and 兼容 in ordinary copy, while keeping model IDs in Advanced Settings.

#### Scenario: User selects model quality
- **GIVEN** the user opens 解读方式
- **WHEN** they choose 模型润色
- **THEN** ordinary UI offers 关闭, 快速, 高质量, and 兼容 without showing `deepseek-v4-pro`, `deepseek-v4-flash`, `deepseek-chat`, or chat endpoint details unless Advanced Settings is expanded

### Requirement: DeepSeek model IDs are valid advanced values
The system SHALL map 高质量 to `deepseek-v4-pro`, 快速 to `deepseek-v4-flash`, and 兼容 to `deepseek-chat` without confusing `/chat/completions` as a model name.

#### Scenario: Advanced settings show exact model
- **GIVEN** the user expands Advanced Settings after choosing a DeepSeek mode
- **WHEN** model settings are visible
- **THEN** the model value is one of `deepseek-v4-pro`, `deepseek-v4-flash`, or `deepseek-chat`, and the chat endpoint is shown separately from the model name

### Requirement: Model narrative is optional polish
The system SHALL describe model use as optional text polish and SHALL continue generating complete reports with local rule narratives.

#### Scenario: Model disabled report works
- **GIVEN** the user chooses 关闭 for 模型润色
- **WHEN** they generate a sample report
- **THEN** the report includes overview, dimension explanations, dayun, yearly, chart, export, and disclaimers without a model key

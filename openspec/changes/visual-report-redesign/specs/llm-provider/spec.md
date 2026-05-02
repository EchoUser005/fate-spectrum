## ADDED Requirements

### Requirement: DeepSeek quality modes are usable in model configuration
The dashboard SHALL expose DeepSeek modes as 关闭, 快速, 高质量, and 兼容 in the model configuration area, with exact model IDs available as model-name choices.

#### Scenario: User selects model quality
- **GIVEN** the user opens 模型配置
- **WHEN** they choose a mode
- **THEN** the UI offers 关闭, 快速, 高质量, and 兼容, and the model-name field maps to `deepseek-v4-pro`, `deepseek-v4-flash`, or `deepseek-chat` without showing chat endpoint details

### Requirement: DeepSeek model IDs are valid configuration values
The system SHALL map 高质量 to `deepseek-v4-pro`, 快速 to `deepseek-v4-flash`, and 兼容 to `deepseek-chat` without confusing `/chat/completions` as a model name.

#### Scenario: Model settings show exact model
- **GIVEN** the user changes the model mode or model name
- **WHEN** model settings are visible
- **THEN** the model value is one of `deepseek-v4-pro`, `deepseek-v4-flash`, or `deepseek-chat`, and `/chat/completions` is not presented as a model name

### Requirement: Model narrative is text polish only
The system SHALL describe model use as optional text polish and SHALL continue generating complete reports with local rule narratives.

#### Scenario: Model disabled report works
- **GIVEN** the user chooses 关闭 in 模型配置
- **WHEN** they generate a report
- **THEN** the report includes overview, dimension explanations, dayun, yearly, chart, export, and disclaimers without a model key

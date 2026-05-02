## ADDED Requirements

### Requirement: Model configuration is direct and required
The dashboard SHALL show direct model-name and model-key fields without local-rule, off, speed, quality, or compatibility mode cards.

#### Scenario: User configures the model directly
- **GIVEN** the user opens 模型配置
- **WHEN** they inspect the visible controls
- **THEN** they see 模型名称 and 模型密钥 without 模型模式, 关闭, 使用本地规则解读, 快速, 高质量, or 兼容 cards

### Requirement: DeepSeek model IDs are valid configuration values
The system SHALL allow `deepseek-v4-pro`, `deepseek-v4-flash`, and `deepseek-chat` as model names without confusing `/chat/completions` as a model name.

#### Scenario: Model settings show exact model
- **GIVEN** the user changes the model mode or model name
- **WHEN** model settings are visible
- **THEN** the model value is one of `deepseek-v4-pro`, `deepseek-v4-flash`, or `deepseek-chat`, and `/chat/completions` is not presented as a model name

### Requirement: Model narrative is required for generated interpretation
The system SHALL require a model key before generating a user-facing interpreted report and SHALL NOT silently fall back to local-rule interpretation when the model is missing or fails.

#### Scenario: Missing model key blocks generation
- **GIVEN** the user has filled birth fields but left 模型密钥 empty
- **WHEN** they generate a report
- **THEN** the app asks them to fill 模型密钥 and does not call the report API

#### Scenario: Model failure does not create fake interpretation
- **GIVEN** the report API cannot obtain model narrative
- **WHEN** generation is requested
- **THEN** the API returns a clear model failure error instead of returning a locally interpreted report as if model interpretation succeeded

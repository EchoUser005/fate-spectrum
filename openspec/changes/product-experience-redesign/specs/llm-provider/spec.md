## ADDED Requirements

### Requirement: DeepSeek V4 defaults
The system SHALL default DeepSeek model configuration to official V4 model ids and identify legacy aliases as deprecated compatibility names.

#### Scenario: User opens DeepSeek provider settings
- **GIVEN** the user enables LLM explanation and chooses DeepSeek
- **WHEN** the model field is shown
- **THEN** the default model is a DeepSeek V4 model id and the UI explains that `deepseek-chat` is a legacy alias

### Requirement: DeepSeek key application guidance
The system SHALL guide users to the official DeepSeek platform and docs for obtaining an API key.

#### Scenario: User needs a key
- **GIVEN** the user has enabled DeepSeek explanation
- **WHEN** they view the API key field
- **THEN** they see official links for applying for a DeepSeek API key and reading the current API model docs

# llm-provider Specification

## Purpose
TBD - created by archiving change bootstrap-fate-spectrum. Update Purpose after archive.
## Requirements
### Requirement: LLM narrative only
The system SHALL use DeepSeek or OpenAI-compatible LLM providers only for narrative explanation based on existing paipan and scoring data.

#### Scenario: LLM cannot change scores
- **GIVEN** a report has rule-based scores
- **WHEN** an LLM narrative is requested
- **THEN** the returned narrative may replace explanation text but the numeric score arrays remain unchanged

### Requirement: BYOK request boundary
The system SHALL accept user API keys per request and SHALL NOT store, log, fixture, or expose those keys in public environment variables.

#### Scenario: Key is not echoed
- **GIVEN** a user submits an LLM key
- **WHEN** an API response or error is returned
- **THEN** the response does not include the key or Authorization header value

### Requirement: LLM fallback
The system SHALL fall back to rule-based explanations when LLM calls fail or produce invalid JSON.

#### Scenario: Invalid LLM JSON
- **GIVEN** the LLM returns text that cannot be parsed as the narrative schema
- **WHEN** report generation finishes
- **THEN** the report still includes rule-based overview, dimension explanations, key windows, and action plan

### Requirement: Safety language
The system SHALL instruct LLM providers to avoid medical diagnosis, investment advice, legal conclusions, and deterministic claims.

#### Scenario: Prompt includes safety boundaries
- **GIVEN** an LLM request is built
- **WHEN** the prompt is inspected
- **THEN** it tells the model to use probabilistic, reflective, and actionable language without professional advice


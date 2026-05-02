# Security

## BYOK Boundary

User API keys are accepted per request and are never stored on the backend, logged, fixture-backed, exported, or exposed through `NEXT_PUBLIC_`. LLM keys may be cached in browser `sessionStorage` for the current session only, and the UI provides a clear action to remove them.

## Log Redaction

API errors are sanitized for common key and Authorization patterns.

## SSRF Defense

Custom paipan endpoints must use HTTPS by default. Localhost, loopback, link-local, and private IP ranges are blocked. `ALLOW_INSECURE_PROVIDER_ENDPOINT=true` is only for local development.

## Prompt Injection

Provider output is untrusted context. LLM system prompts forbid following instructions embedded in paipan JSON or user text.

## Professional Advice

Reports include general, health, and wealth disclaimers. Health energy is not medical diagnosis; wealth is not investment advice.

## Custom Endpoint Risk

User-provided paipan endpoints can be unavailable, malformed, or unsafe. The MVP validates URL safety, payload size, response shape, and error redaction.

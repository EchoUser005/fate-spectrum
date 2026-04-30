# ADR 0003: Use BYOK LLM Provider

## Status

Accepted

## Context

Users may use DeepSeek or OpenAI-compatible keys, but the MVP has no login, database, or tenant isolation.

## Decision

Use BYOK per request. Keys are not stored, logged, fixture-backed, or exposed through public variables.

## Alternatives

- Site-owned shared key: shifts cost and abuse risk to maintainer.
- Stored user keys: requires auth and secure persistence.

## Consequences

Users must provide a key when they want LLM narrative. Mock/rule reports still work without keys.

## Follow-up

Evaluate optional encrypted storage only after authentication exists.

# ADR 0004: LLM Does Not Own Scoring

## Status

Accepted

## Context

Scores must be explainable, repeatable, and testable. LLM output can vary and may hallucinate.

## Decision

LLMs can only generate narrative text from existing paipan JSON and rule-based scores.

## Alternatives

- Ask LLM for scores: non-deterministic and hard to audit.
- No LLM at all: less useful explanatory prose.

## Consequences

The report can be generated without LLM. If LLM fails, the system falls back to rule explanations.

## Follow-up

Add prompt regression tests for safety boundaries.

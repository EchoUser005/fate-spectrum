# ADR 0005: Use Rule-Based Scoring Engine

## Status

Accepted

## Context

Fate Spectrum needs seven dimensions, dayun/yearly windows, and scoring that contributors can inspect.

## Decision

Implement deterministic rules with configurable dimension definitions, ganzhi helpers, palace/output signals, and tests.

## Alternatives

- Machine-learned scoring: no labeled dataset.
- Hard-coded UI-only scores: not explainable or reusable.

## Consequences

Scores are stable and testable, but require calibration against real provider data and expert review.

## Follow-up

Calibrate rule weights after live shenjige response mapping is confirmed.

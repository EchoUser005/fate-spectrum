## Why

Fate Spectrum is ready for its first public demo review, but the MVP still needs live shenjige response calibration, clearer public-facing provider limitations, stronger report-stage feedback, and collaboration/deployment guides that let multiple contributors continue safely. The bootstrap change intentionally stayed active as the MVP traceability surface; this change hardens that MVP without re-bootstrapping the project.

## What Changes

- Add OpenSpec traceability for public demo hardening across paipan provider, report generation, UI dashboard, security, collaboration, and deployment.
- Calibrate the shenjige custom provider against one anonymous local live request without storing API keys, private data, or full provider responses.
- Update response schema, normalization, tests, and API docs if the live shenjige structure differs from `sample-paipan.json`.
- Add tests for shenjige normalization, optional/malformed response behavior, unsupported calendar/gender errors, and true-solar-time prompting.
- Harden the public demo UI so Mock Demo works in one click, LLM responsibility is clear, shenjige limitations are explicit, report stages are visible, and dimension explanations are prominent.
- Ensure JSON and Markdown exports include professional-advice disclaimers.
- Add or complete contributor docs, PR template, issue templates, deployment docs, and a disabled server auto-deploy workflow template.
- Decide whether `bootstrap-fate-spectrum` can be archived after public demo hardening, or document why it remains active.

## Capabilities

### New Capabilities

- `collaboration`: Contributor guide, branch naming, PR checklist, issue templates, and multi-person OpenSpec workflow.

### Modified Capabilities

- `paipan-provider`: Live shenjige calibration, normalized response compatibility, unsupported-input errors, and true-solar-time prompts.
- `report-generation`: Explicit generation phases, dimension-first report output, and export disclaimer coverage.
- `ui-dashboard`: Public demo copy, one-click mock flow, provider limitation notices, report-stage display, responsive layout, and product language retention.
- `security`: Secret-safe live calibration, sanitized fixtures, key-safe errors, and export disclaimer boundaries.
- `deployment`: CI documentation, Vercel/Docker steps, server deploy secret placeholders, and disabled auto-deploy template.

## Impact

- Touches provider schemas and normalization only as required by the live shenjige response shape.
- Adds focused unit/API tests before provider and API implementation changes.
- Touches dashboard components and export utilities for public demo clarity.
- Adds repository collaboration and deployment documentation.
- Does not add authentication, persistence, payment, a local paipan algorithm, domain binding, or active production server deployment.

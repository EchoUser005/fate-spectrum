# Architecture

Fate Spectrum is a stateless Next.js App Router application.

## Modules

- Frontend: `src/app/page.tsx`, `src/components/*`
- API: `src/app/api/health`, `src/app/api/paipan`, `src/app/api/report`
- Schemas: `src/lib/schemas/*`
- Paipan: `src/lib/paipan/*`
- Scoring: `src/lib/scoring/*`
- LLM: `src/lib/llm/*`
- Export: `src/lib/export/*`
- Fixtures: `src/fixtures/*`

## Text Architecture Diagram

User Browser -> Birth/Model Workbench -> `/api/report` -> Real Paipan Provider -> Normalizer -> Rule Scoring Engine -> Required Model Narrative -> ReportResponse -> Dashboard/Export

## Data Flow

1. `BirthInput` and model/provider config are validated by Zod.
2. The real paipan provider returns or wraps `PaipanResponse`.
3. Normalizer creates pillars, palaces, identity, outputs, and dayun windows.
4. Scoring engine computes dayun and yearly `ScoreMap` values.
5. Rule explanations are generated.
6. Model adapter receives only existing data and returns `Narrative`; if it fails, the API returns a clear error.
7. UI renders report and prepares Markdown export.

## Boundaries

- API keys are request-only.
- Custom endpoints are blocked if unsafe.
- LLM never owns numeric scores.
- No persistence layer exists in MVP.

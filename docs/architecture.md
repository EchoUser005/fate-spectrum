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

User Browser -> Birth/Provider Forms -> `/api/report` -> Paipan Provider -> Normalizer -> Rule Scoring Engine -> Optional LLM Narrative -> ReportResponse -> Dashboard/Export

## Data Flow

1. `BirthInput` and `ProviderConfig` are validated by Zod.
2. Paipan provider returns or wraps `PaipanResponse`.
3. Normalizer creates pillars, palaces, identity, outputs, and dayun windows.
4. Scoring engine computes dayun and yearly `ScoreMap` values.
5. Rule explanations are generated.
6. Optional LLM adapter receives only existing data and returns `Narrative`.
7. UI renders report and prepares Markdown/JSON export.

## Boundaries

- API keys are request-only.
- Custom endpoints are blocked if unsafe.
- LLM never owns numeric scores.
- No persistence layer exists in MVP.

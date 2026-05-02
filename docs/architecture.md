# Architecture

Fate Spectrum is a single-user, private-first Next.js App Router application.

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

First run:

User Browser -> Birth/Model Workbench -> `/api/report` -> Real Paipan Provider -> Normalizer -> Rule Scoring Engine -> Local Prompt Registry -> Optional Langfuse Override -> Required Model Narrative -> ReportResponse -> Browser Profile Store -> `/chart`

Return visits:

User Browser -> Browser Profile Store -> `/chart`

## Data Flow

1. `BirthInput` and model/provider config are validated by Zod.
2. The real paipan provider returns or wraps `PaipanResponse`.
3. Normalizer creates pillars, palaces, identity, outputs, and dayun windows.
4. Scoring engine computes dayun and yearly `ScoreMap` values.
5. Rule explanations are generated.
6. Model adapter receives only existing data and returns `Narrative`; if it fails, the API returns a clear error.
7. The initialization page saves the completed primary report in browser local storage and redirects to `/chart`.
8. The chart page reads the persisted primary report until the user chooses to clear the primary profile.

## Product Flow

- `/` is the first-run initialization surface.
- `/chart` is the primary profile workspace.
- A generated report is persisted as the single primary profile.
- The app redirects returning users with a saved primary profile from `/` to `/chart`.
- Clearing the primary profile removes local persisted data and returns to `/`.

This keeps the current version simple while preserving the product model: one private primary chart first, then future relationship charts and interaction analysis around that owner.

## Prompt and AI Backend Direction

Prompt text is maintained in the repository instead of being hardcoded in business logic. The local source of truth is:

- `prompts/fate-spectrum-narrative.v1.json`

GitHub provides version history for prompt changes. Runtime Langfuse lookup is optional and environment-driven:

- Prompt name: `fate-spectrum-narrative`
- Default label: `production`
- Runtime variables:
  - `{{context}}`: normalized paipan, dimensions, dayun scores, yearly scores, output shape, and disclaimers

If Langfuse is not configured or unavailable, the app uses the local prompt file. Do not commit real Langfuse hosts, keys, traces, or private prompt deployments.

The next backend iteration should move calendar context generation out of UI code and into a dedicated AI backend service inspired by `zhoubazi`:

- Build a complete context object before model calls.
- Preserve the hierarchy: original chart -> dayun -> yearly -> monthly -> daily.
- Use real calendar/ganzhi calculations for monthly and daily context.
- Add Langfuse tracing for each generation, including prompt version, model, input summary, output summary, and parse result.
- Never store model keys in persisted profile data.

Optional server-only environment variables:

```env
LANGFUSE_BASE_URL=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_PROMPT_LABEL=production
```

These values belong in `.env.local` or deployment secrets only.

## Boundaries

- API keys are request-only.
- Custom endpoints are blocked if unsafe.
- LLM never owns numeric scores.
- Browser profile persistence is local to the user's browser in this version.
- Server-side JSON/Markdown persistence can be added later for private Docker deployments without changing the report schema.

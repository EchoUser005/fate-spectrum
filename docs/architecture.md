# Architecture

Fate Spectrum is a single-user, private-first Next.js App Router application.

## Open-Source Product Goal

The open-source version is designed to be useful before it becomes a full personal-data flywheel. The current release focuses on a safe, inspectable MVP:

- real paipan input, deterministic scoring, and structured analysis context
- P0 AI modules for natal portrait, element energy, and current environment
- optional Langfuse prompt operations for maintainers
- optional FastAPI JSON/Markdown memory service for owner/guest profiles
- Docker Compose that starts without checked-in secrets or local data

The architecture intentionally separates chart facts, scoring, prompt output, trace metadata, and future memory evidence. That separation keeps the project hackable for open-source users while protecting the future product path from becoming one large prompt blob.

## Modules

- Frontend: `src/app/page.tsx`, `src/components/*`
- API: `src/app/api/health`, `src/app/api/paipan`, `src/app/api/report`
- Schemas: `src/lib/schemas/*`
- Paipan: `src/lib/paipan/*`
- Scoring: `src/lib/scoring/*`
- Analysis context: `src/lib/analysis/report-analysis.ts`, `src/lib/analysis/lifecycle.ts`
- LLM: `src/lib/llm/*`
- Export: `src/lib/export/*`
- Fixtures: `src/fixtures/*`

## Text Architecture Diagram

First run:

User Browser -> Birth/Model Workbench -> `/api/report` -> Real Paipan Provider -> Normalizer -> Rule Scoring Engine -> Structured Analysis Context -> Local Prompt Registry -> Optional Langfuse `prod` Prompt -> P0 Prompt Modules -> Langfuse Trace -> ReportResponse -> Browser Profile Store -> `/chart` -> Optional FastAPI Memory Store

Return visits:

User Browser -> Browser Profile Store -> `/chart`

## Data Flow

1. `BirthInput` and model/provider config are validated by Zod.
2. The real paipan provider returns or wraps `PaipanResponse`.
3. Normalizer creates pillars, palaces, identity, outputs, and dayun windows.
4. Scoring engine computes dayun and yearly `ScoreMap` values.
5. `buildReportAnalysis` creates `analysis.context`, `analysis.portrait`, `analysis.elementProfile`, and `analysis.currentEnvironment` as deterministic fallback structures.
6. Rule explanations are generated for backward-compatible narrative fields.
7. Model adapter receives only existing context data. Prompt modules may succeed independently; portrait, element energy, and current environment are P0, while overview, dimensions, and windows remain compatible fallback modules.
8. When Langfuse is configured, each prompt module writes a generation under the same `fate-spectrum/report-generation` trace with prompt name, version, model, output, parse state, and redacted input by default.
9. The initialization page saves the completed primary report in browser local storage and redirects to `/chart`.
10. If `FATE_MEMORY_API_URL` is configured, the report API also writes a best-effort JSON/Markdown snapshot to the FastAPI memory service.
11. The chart page reads the persisted primary report until the user chooses to clear the primary profile.

## Product Flow

- `/` is the first-run initialization surface.
- `/chart` is the primary profile workspace.
- A generated report is persisted as a 命主 profile first; later generated charts become 缘主 profiles.
- The app redirects returning users with a saved primary profile from `/` to `/chart`.
- Clearing the primary profile removes local persisted data and returns to `/`.

This keeps the current version simple while preserving the product model: one private primary chart first, then future relationship charts and interaction analysis around that owner.

## Prompt and AI Backend Direction

Prompt text is maintained in the repository instead of being hardcoded in business logic. The local source of truth is:

- `prompts/fate-spectrum/<ai-function>/prompt.json`
- `prompts/fate-spectrum/<ai-function>/system.md`
- `prompts/fate-spectrum/<ai-function>/user.md`

GitHub provides version history for prompt changes. Runtime Langfuse lookup is optional and environment-driven:

- Prompt names: `fate-spectrum/portrait`, `fate-spectrum/overview`, `fate-spectrum/element-energy`, `fate-spectrum/current-environment`, `fate-spectrum/dimensions`, `fate-spectrum/windows`, `fate-spectrum/weekly-daily`, `fate-spectrum/monthly-rollup`, `fate-spectrum/yearly-memory`
- Default label: `prod`
- Runtime variables:
  - `{{context}}`: `userInfo`, normalized paipan, dimensions, dayun scores, yearly scores, output shape, and disclaimers

If Langfuse is configured, the app fetches the `prod` prompt first. If the prompt is missing in Langfuse, the app seeds the local prompt once. If Langfuse is not configured or unavailable, the app uses the local prompt file. Do not commit real Langfuse hosts, keys, traces, or private prompt deployments.

P0 analysis lifecycle is documented in `docs/analysis-lifecycle.md`:

- `fate-spectrum/portrait`: initialized once per primary profile, manually refreshed after prompt or birth-data changes.
- `fate-spectrum/element-energy`: stable natal energy structure; not a daily regeneration target.
- `fate-spectrum/current-environment`: can refresh when the observation date, flow year/month, or prompt version changes.

The next backend iteration should move calendar context generation out of UI code and into a dedicated AI backend service inspired by `zhoubazi`:

- Build a complete context object before model calls.
- Preserve the hierarchy: original chart -> dayun -> yearly -> monthly -> daily.
- Use real calendar/ganzhi calculations for monthly and daily context.
- Expand Langfuse scores and datasets after user feedback exists; current tracing is observational only.
- Never store model keys in persisted profile data.

Optional server-only environment variables:

```env
LANGFUSE_BASE_URL=https://us.cloud.langfuse.com
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_PROMPT_LABEL=prod
LANGFUSE_TRACE_ENABLED=true
LANGFUSE_TRACE_CONTENT=redacted
```

These values belong in `.env.local` or deployment secrets only.

## Adaptive Memory Flywheel Direction

The next architecture change is tracked in `openspec/changes/adaptive-memory-flywheel/` and summarized publicly in `docs/memory-flywheel.md`.

The intended long-running product loop is:

```text
initial report -> daily guidance -> evening feedback -> daily memory -> weekly report -> monthly rollup -> yearly memory -> adaptive score candidate -> regenerated report context
```

Design constraints:

- baseline paipan scores remain deterministic and inspectable
- future adaptive scores are derived from memory evidence and bounded rules
- default future blend is proposed as `baseScore * 0.7 + adaptiveScore * 0.3`
- LLMs can summarize, classify, and explain, but cannot directly set numeric scores
- JSON/Markdown files hold user-readable artifacts
- SQLite holds indexes, events, prompt runs, score versions, and replay metadata
- Docker Compose should run without Langfuse or a checked-in `.env`

## Boundaries

- API keys are request-only.
- Custom endpoints are blocked if unsafe.
- LLM never owns numeric scores.
- Browser profile persistence is local to the user's browser.
- Server-side JSON/Markdown persistence is optional through the FastAPI memory service and Docker volume.

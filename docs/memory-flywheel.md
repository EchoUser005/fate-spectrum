# Adaptive Memory Flywheel

This document describes the planned long-term product loop for Fate Spectrum. It is an architecture proposal, not a completed feature.

## Goal

Fate Spectrum starts with a deterministic chart report: paipan, baseline dayun/yearly scores, and model-written interpretation. The next product stage adds a private memory loop:

```text
initial report
-> daily guidance
-> evening user feedback
-> daily memory summary
-> weekly report
-> monthly rollup
-> yearly memory
-> adaptive score candidate
-> regenerated report context
```

The product idea is: 基础盘面 gives orientation; repeated lived feedback gives adjustment space. Same-chart users may share a baseline pattern, but their memories, actions, and environments can gradually change the adaptive layer.

## Storage Strategy

Use a hybrid storage model:

- JSON/Markdown files for user-readable artifacts.
- SQLite for indexes, event records, score versions, prompt runs, and replay tests.
- No cloud database required for the private single-user deployment.
- No vector database in the first implementation. Add one only if SQLite FTS and rollup summaries are not enough.

Suggested private data layout:

```text
data/
  owner/
    profile.json
    reports/
    memory/
      daily/
      weekly/
      monthly/
      yearly/
    scores/
      base.json
      adaptive.json
      versions/
  guests/
    <guest-id>/
      profile.json
      reports/
      memory/
  index.sqlite
```

Generated `data/owner/`, `data/guests/`, and SQLite files must stay private and ignored by Git.

## Score Model

The current score engine remains the baseline.

Future adaptive scoring should expose three layers:

```text
baseScore      deterministic paipan score
adaptiveScore  memory-derived candidate score
finalScore     blended display score
```

Default proposed blend:

```text
finalScore = baseScore * 0.7 + adaptiveScore * 0.3
```

Rules:

- LLM output must not directly set scores.
- Every adaptive delta must have evidence event IDs.
- The baseline must remain inspectable.
- Score changes must be replayable from stored memory events.
- Adjustment bounds must prevent one day of feedback from rewriting a decade.

## Prompt Registry

Prompt files live under:

```text
prompts/fate-spectrum/<ai-function>/
  prompt.json
  system.md
  user.md
```

Planned memory prompt functions:

- `daily-guidance`
- `daily-feedback-summary`
- `weekly-daily`
- `monthly-rollup`
- `yearly-memory`
- `adaptive-score-candidate`
- `relationship-context`

Runtime behavior:

- Open-source users can run from local prompt files.
- Maintainer deployments can configure Langfuse.
- If Langfuse is configured, `prod` prompts win over local files.
- `pnpm prompts:sync` publishes local prompts.
- `pnpm prompts:pull` pulls tuned `prod` prompts back to local files.

## Model Gateway

The project should route all model calls through one gateway:

```text
report flow       -> model gateway -> provider adapter
memory flywheel   -> model gateway -> provider adapter
future features   -> model gateway -> provider adapter
```

Planned providers:

- DeepSeek
- Gemini
- Grok
- OpenAI-compatible
- Future configurable model names through env/config

Provider-specific details should not leak into report generation, scoring, or UI code.

## Replay Testing

The flywheel needs replay tests because ordinary unit tests do not cover long-running memory behavior.

Replay fixture shape:

```text
fixtures/memory-replay/<case>/
  owner-profile.json
  base-report.json
  daily-events.json
  mocked-prompt-outputs.json
  expected-weekly.json
  expected-monthly.json
  expected-yearly.json
  expected-score-version.json
```

Replay should prove:

- fixed inputs produce fixed memory rollups
- score candidates remain bounded
- removing an event removes its evidence
- changing prompt output changes summaries but cannot directly mutate scores
- regenerated score versions can be audited

## Deployment

Docker Compose should remain the easiest path for ordinary users:

```bash
docker compose up -d --build
```

Expected behavior:

- Next.js app on port `3000`
- FastAPI memory service on port `8000`
- private data stored in a Docker volume
- no Langfuse required
- no checked-in `.env` required

## Implementation Order

1. Review the OpenSpec change `adaptive-memory-flywheel`.
2. Add SQLite migrations and file/index persistence.
3. Add model gateway.
4. Add daily feedback and rollup endpoints.
5. Add replay fixtures and tests.
6. Add bounded adaptive score candidates.
7. Design the daily guidance / feedback UI.

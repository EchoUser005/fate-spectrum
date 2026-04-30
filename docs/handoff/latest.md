# Handoff Latest

## Project State

Fate Spectrum is bootstrapped as a local Next.js repository at `/Users/m4pro/Documents/fate_spectrum/fate-spectrum`. It has OpenSpec, code, tests, docs, CI, Docker, and Vercel configuration. Local validation passed.

## Completed Modules

- Schemas: `src/lib/schemas/*`
- Paipan: mock provider, custom provider, shenjige mapping, normalization
- Scoring: dimensions, ganzhi helpers, dayun/yearly scoring, rule explanations
- LLM: DeepSeek/OpenAI-compatible adapters, prompt, safe JSON extraction
- API: `/api/health`, `/api/paipan`, `/api/report`
- UI: app shell, forms, report dashboard, charts, heatmap, tables, raw JSON, export actions
- Export: Markdown and JSON
- Tests: unit tests and Playwright mock flow

## Not Completed

- Real shenjige response mapping needs live calibration.
- GitHub remote creation/push is blocked because `gh` is not installed.
- Bootstrap OpenSpec change remains unarchived until first public-demo validation.

## Current Risks

- shenjige response shape may need mapping adjustments.
- Playwright browsers may need separate installation on fresh machines with `pnpm exec playwright install chromium`.

## User Must Provide Later

1. GitHub CLI installation/login or SSH remote setup.
2. Domain.
3. Confirmation for true solar time algorithm.
4. Confirmation for lunar conversion library.
5. Confirmation for overseas timezone conversion.
6. Whether to store history.
7. Whether to allow sessionStorage key storage.
8. Whether to implement PDF export.
9. Whether to implement multilingual UI.

## First Files To Read Next Time

- `AGENTS.md`
- `README.md`
- `TODO.md`
- `openspec/changes/bootstrap-fate-spectrum/`
- `docs/devlog/latest.md`
- `docs/handoff/latest.md`
- `docs/test-matrix.md`

## First Commands To Run Next Time

```bash
openspec validate --all --strict --no-interactive
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

## Current Validation

- `openspec validate --all --strict --no-interactive` passed.
- `pnpm lint` passed.
- `pnpm test` passed, 13 unit tests.
- `pnpm build` passed with `next build --webpack`.
- `pnpm test:e2e` passed, 1 Chromium test.

## Remote Push Commands If Needed

```bash
gh auth login
gh repo create EchoUser005/fate-spectrum --public --description "Open-source BaZi and Ziwei multidimensional life spectrum dashboard."
git remote add origin git@github.com:EchoUser005/fate-spectrum.git
git push -u origin main
```

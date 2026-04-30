# Handoff Latest

## Project State

Fate Spectrum is a Next.js repository at `/Users/m4pro/Documents/fate_spectrum/fate-spectrum` with OpenSpec, code, tests, docs, CI, Docker, Vercel config, collaboration templates, and deployment guidance. The Git remote is `https://github.com/EchoUser005/fate-spectrum`.

## OpenSpec State

- `bootstrap-fate-spectrum` has been archived to `openspec/changes/archive/2026-04-30-bootstrap-fate-spectrum/`.
- Main specs now live in `openspec/specs/`.
- Active change: `public-demo-hardening`.
- `public-demo-hardening` remains active for public demo review; archive it after reviewer acceptance or add follow-up tasks if more hardening is needed.

## Completed This Round

- Public demo OpenSpec change and traceability matrix.
- Real shenjige calibration with anonymous sample only.
- Shenjige mapping update for `hour`, `h`, and `m`.
- Numeric shenjige `status` compatibility.
- Malformed provider response rejection before scoring.
- Non-blocking true-solar-time prompt for Mock Demo when no coordinates are provided.
- Public demo UI copy for Mock Demo, LLM explanation-only behavior, and shenjige limitations.
- Visible generation stages, dimension-first explanation, mobile E2E coverage, and export disclaimer coverage.
- CONTRIBUTING, PR template, bug/feature issue templates, deployment doc expansion, and disabled/manual server deploy workflow template.

## Current Risks

- Real shenjige provider availability and undocumented behavior can still drift.
- Retry/backoff and richer provider error taxonomy are not implemented yet.
- No lunar conversion, overseas timezone conversion, or true-solar-time coordinate math yet.
- Vercel deployment, domain binding, and brand OG image remain open public-demo tasks.

## Current Validation

- `openspec validate --all --strict --no-interactive` passed.
- `pnpm lint` passed.
- `pnpm test` passed, 23 unit tests.
- `pnpm build` passed with `next build --webpack`.
- `pnpm test:e2e` passed after escalation, 2 Chromium tests.

## Useful Notes

- Do not commit full live shenjige responses. Keep fixtures anonymous and minimal.
- If Playwright reuses a stale port 3000 server, stop the old local Next process and rerun `pnpm test:e2e`.
- E2E may need escalation because local port binding can be blocked by the sandbox.
- The disabled server workflow intentionally exits before real deployment; it only documents future secrets and guard rails.

## User Must Provide Later

1. Vercel project import/deployment decision.
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
- `openspec/specs/`
- `openspec/changes/public-demo-hardening/`
- `docs/devlog/latest.md`
- `docs/handoff/latest.md`
- `docs/test-matrix.md`
- `docs/adr/`

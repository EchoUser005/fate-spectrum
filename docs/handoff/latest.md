# Handoff Latest

## Project State

Fate Spectrum is a Next.js repository at `/Users/m4pro/Documents/fate_spectrum/fate-spectrum` with OpenSpec, code, tests, docs, CI, Docker, Vercel config, collaboration templates, and deployment guidance. The Git remote is `https://github.com/EchoUser005/fate-spectrum`.

## OpenSpec State

- `bootstrap-fate-spectrum` has been archived to `openspec/changes/archive/2026-04-30-bootstrap-fate-spectrum/`.
- Main specs now live in `openspec/specs/`.
- Active changes: `public-demo-hardening` and `product-experience-redesign`.
- `public-demo-hardening` remains active for public demo review; archive it after reviewer acceptance or add follow-up tasks if more hardening is needed.
- `product-experience-redesign` addresses user feedback that the interface felt like raw paipan/debug output instead of a product.

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
- Outcome-first homepage and report hierarchy.
- Recharts-backed radar spectrum overview.
- Action plan and timing windows before source data.
- Advanced disclosure for BaZi, Ziwei palace grid, and raw JSON.
- DeepSeek V4 default model and official key guidance.
- Browser-session-only LLM key cache and clear action.

## Current Risks

- Real shenjige provider availability and undocumented behavior can still drift.
- Retry/backoff and richer provider error taxonomy are not implemented yet.
- No lunar conversion, overseas timezone conversion, or true-solar-time coordinate math yet.
- Vercel deployment, domain binding, and brand OG image remain open public-demo tasks.
- OpenAI-compatible non-DeepSeek model list still needs confirmation.

## Current Validation

- `openspec validate --all --strict --no-interactive` passed.
- `pnpm lint` passed.
- `pnpm test` passed, 25 unit tests.
- `pnpm build` passed with `next build --webpack`.
- `pnpm test:e2e` passed after escalation, 3 Chromium tests.

## Useful Notes

- Do not commit full live shenjige responses. Keep fixtures anonymous and minimal.
- If Playwright reuses a stale port 3000 server, stop the old local Next process and rerun `pnpm test:e2e`.
- E2E may need escalation because local port binding can be blocked by the sandbox.
- The disabled server workflow intentionally exits before real deployment; it only documents future secrets and guard rails.
- DeepSeek docs on 2026-04-24 list `deepseek-v4-flash` and `deepseek-v4-pro`; `deepseek-chat` is a legacy alias scheduled for deprecation on 2026-07-24.
- LLM keys are cached only in browser `sessionStorage`; exports and reports do not include them.

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
- `openspec/changes/product-experience-redesign/`
- `docs/devlog/latest.md`
- `docs/handoff/latest.md`
- `docs/test-matrix.md`
- `docs/adr/`

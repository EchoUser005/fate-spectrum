# Dev Log Latest

## Current Status

Product experience redesign is in progress on top of second-round public demo hardening. Bootstrap OpenSpec has been archived into main specs. `public-demo-hardening` remains active, and `product-experience-redesign` is the current product UX correction change.

## Current Branch

`main`

## Current OpenSpec Change

`product-experience-redesign`

## Recently Completed

- Created `openspec/changes/public-demo-hardening/` with proposal, design, tasks, and spec deltas for paipan provider, report generation, UI dashboard, security, collaboration, and deployment.
- Updated `docs/test-matrix.md` with Requirement -> Task -> Test traceability.
- Ran one anonymous shenjige live calibration request. No API key, private input, or full raw response was recorded.
- Confirmed successful shenjige response field presence for `status`, `message`, `data.zw`, `data.bz`, `data.bz.y`, `data.bz.m`, `data.bz.d`, `data.bz.h`, `data.bz.dayunGZ`, `data.bz.dayunAge`, `data.bz.dayunYear`, and `data.output`.
- Calibrated shenjige mapping: successful requests need `hour`, `h`, and `m`; response `status` is numeric.
- Updated Zod schema and normalization to handle numeric provider status, reject malformed BaZi containers, and keep output compatibility.
- Added unit tests for shenjige normalization, missing optional fields, malformed responses, unsupported lunar input, unknown gender, true-solar-time prompt, SSRF blocking, and export disclaimers.
- Hardened public demo UI copy, one-click Mock Demo, generation stages, dimension-first report explanation, mobile E2E coverage, and export disclaimer messaging.
- Added or updated CONTRIBUTING, PR template, issue templates, deployment docs, and a disabled/manual server deploy workflow template.
- Archived `bootstrap-fate-spectrum` as `openspec/changes/archive/2026-04-30-bootstrap-fate-spectrum/`.
- Created `product-experience-redesign` after public-demo feedback that the UI was too raw-data/provider oriented.
- Reworked the homepage and report around user outcomes, timing windows, action plan, and Recharts-backed spectrum shape.
- Moved BaZi, Ziwei palace grid, and raw paipan JSON into an advanced source-data disclosure.
- Updated DeepSeek default model to `deepseek-v4-flash`, added `deepseek-v4-pro`, retained `deepseek-chat` only as a legacy alias option.
- Added official DeepSeek platform/docs links and browser-session-only LLM key caching with a clear action.

## Shenjige Calibration Summary

- Initial request with only `hour` returned HTTP 200 JSON with numeric status and message but no usable `data.zw` or `data.bz`.
- Public frontend mapping inspection showed the request also sends numeric `h` and `m`.
- Anonymous retry with `hour=子`, `h=23`, and `m=0` returned the required successful structure.
- The repository stores only minimal anonymous fixtures in tests, not the full live response.

## Commands Run

- `openspec new change public-demo-hardening` -> success.
- `openspec validate --all --strict --no-interactive` -> success before implementation.
- Anonymous shenjige structure check -> success after network escalation, field summary only.
- `pnpm test` -> success, 23 unit tests passed.
- `pnpm lint` -> success.
- `pnpm build` -> success with `next build --webpack`.
- `openspec archive bootstrap-fate-spectrum -y` -> success.
- `openspec validate --all --strict --no-interactive` -> success after archive.
- `pnpm test:e2e` -> success after escalation and stale dev-server cleanup, 2 Chromium tests passed.
- `pnpm test` -> success after product redesign, 25 unit tests passed.
- `pnpm lint` -> success after product redesign.
- `pnpm build` -> success after product redesign.
- `pnpm test:e2e` -> success after product redesign, 3 Chromium tests passed.

## Fixed During This Round

- E2E initially failed in sandbox because the Next dev server could not bind port 3000; rerun with escalation.
- E2E initially reused an old local dev server on port 3000; stopped stale processes and reran against current code.
- E2E strict text locators were adjusted to heading/exact locators.

## Unfinished Tasks

- Public demo deployment to Vercel is still user/maintainer-owned.
- Production-grade retry/backoff for real paipan provider remains TODO.
- OpenAI-compatible non-DeepSeek model list confirmation remains TODO.
- Domain binding and brand OG asset remain TODO.

## Next Codex Step

Continue from `openspec/changes/product-experience-redesign/tasks.md`, `docs/test-matrix.md`, and this devlog. If the product UX correction is accepted, archive `product-experience-redesign`; after public demo review, also decide whether to archive `public-demo-hardening`.

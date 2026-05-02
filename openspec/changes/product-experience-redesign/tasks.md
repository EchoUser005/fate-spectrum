## 1. OpenSpec and Research

- [x] 1.1 Create `product-experience-redesign` OpenSpec change.
- [x] 1.2 Verify current DeepSeek model guidance from official docs.
- [x] 1.3 Check community chart guidance and choose existing Recharts/shadcn-chart-compatible approach.
- [x] 1.4 Add proposal, design, tasks, and spec deltas.
- [x] 1.5 Validate OpenSpec before implementation.

## 2. Product Experience Redesign

- [x] 2.1 Rework homepage copy away from raw paipan/source-data framing and toward user outcomes.
- [x] 2.2 Reorder report so outcome summary, next windows, and action plan come before source data.
- [x] 2.3 Move BaZi pillars, Ziwei palace grid, and raw paipan JSON into optional advanced/source sections.
- [x] 2.4 Add Recharts-backed spectrum overview/radar or radial visualization for dimension shape.
- [x] 2.5 Keep product language around spectrum, rhythm, windows, and actions without presenting one total score.

## 3. DeepSeek V4 and Key Cache

- [x] 3.1 Update DeepSeek default model to V4 and expose V4 model choices.
- [x] 3.2 Add DeepSeek API key application guidance with official links.
- [x] 3.3 Cache entered LLM key/config in browser session storage only.
- [x] 3.4 Add a clear cached-key action and copy that no key is sent to storage/server beyond the request.

## 4. Tests and Docs

- [x] 4.1 Add or update unit tests for provider defaults and key-safe exports.
- [x] 4.2 Update E2E for outcome-first report, advanced raw JSON disclosure, DeepSeek guidance, and key cache behavior.
- [x] 4.3 Update docs/test-matrix.md.
- [x] 4.4 Update README, TODO, CHANGELOG, devlog, and handoff.

## 5. Verification and Commit

- [x] 5.1 Run `openspec validate --all --strict --no-interactive`.
- [x] 5.2 Run `pnpm lint`.
- [x] 5.3 Run `pnpm test`.
- [x] 5.4 Run `pnpm build`.
- [x] 5.5 Run `pnpm test:e2e`.
- [x] 5.6 Commit and push if remote access is available.

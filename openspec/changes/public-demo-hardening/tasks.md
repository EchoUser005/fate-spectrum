## 1. OpenSpec and Traceability

- [x] 1.1 Create `openspec/changes/public-demo-hardening/`.
- [x] 1.2 Add proposal, design, and task plan.
- [x] 1.3 Add spec deltas for paipan provider, report generation, UI dashboard, security, collaboration, and deployment.
- [x] 1.4 Update `docs/test-matrix.md` with Requirement -> Task -> Test traceability.
- [x] 1.5 Validate OpenSpec before implementation.

## 2. Shenjige Calibration and TDD

- [x] 2.1 Add failing unit tests for shenjige response normalization, missing optional fields, and malformed response handling.
- [x] 2.2 Add API/provider tests for lunar calendar rejection, unknown gender rejection, and true-solar-time prompting without blocking Mock Demo.
- [x] 2.3 Run one anonymous local live shenjige request without logging API key or full raw response.
- [x] 2.4 Compare live field presence with `sample-paipan.json` and record only sanitized findings.
- [x] 2.5 Update Zod schema, normalization, and minimal sanitized fixtures if live structure requires compatibility changes.
- [x] 2.6 Update `docs/api.md` and `docs/devlog/latest.md` with calibrated behavior and limitations.

## 3. Public Demo UI Hardening

- [x] 3.1 Make Mock Demo one-click and key-free in visible copy and flow.
- [x] 3.2 Clarify that DeepSeek/OpenAI-compatible LLMs explain only and do not perform paipan.
- [x] 3.3 Clarify shenjige limitations: solar only, male/female only, no overseas timezone conversion, true solar time only preserved as a prompt.
- [x] 3.4 Display generation stages: validate input, fetch paipan, normalize paipan, compute spectrum scores, generate explanation, render result.
- [x] 3.5 Make dimension explanations prominent and avoid single-total-score framing.
- [x] 3.6 Preserve product terms: 多维度能量谱, 大运光谱, 流年色阶, 光谱曲线, 色阶图, 星盘宫格, 原始排盘 JSON.
- [x] 3.7 Check mobile layout and E2E-visible public demo sections.
- [x] 3.8 Ensure Markdown and JSON exports include disclaimers.

## 4. Collaboration and Deployment

- [x] 4.1 Add or update `CONTRIBUTING.md` with required read-before-change, OpenSpec-first workflow, branch naming, tests, validation commands, and PR expectations.
- [x] 4.2 Add `.github/pull_request_template.md`.
- [x] 4.3 Add bug report and feature request issue templates.
- [x] 4.4 Expand `docs/deployment.md` with GitHub Actions CI, Vercel, Docker Compose, and future server deploy secrets.
- [x] 4.5 Add disabled/manual server auto-deploy workflow template with documented secrets only.

## 5. Bootstrap Change Decision

- [x] 5.1 Re-evaluate `bootstrap-fate-spectrum` against MVP acceptance after public demo hardening.
- [x] 5.2 Archive `bootstrap-fate-spectrum` if complete, or document the retention reason in `docs/handoff/latest.md`.
- [x] 5.3 Leave `public-demo-hardening` active unless it is fully complete and verified.

## 6. Verification, Handoff, and Commit

- [x] 6.1 Run `openspec validate --all --strict --no-interactive`.
- [x] 6.2 Run `pnpm lint`.
- [x] 6.3 Run `pnpm test`.
- [x] 6.4 Run `pnpm build`.
- [x] 6.5 Run `pnpm test:e2e`.
- [x] 6.6 Update CHANGELOG, TODO, devlog, handoff, and task statuses.
- [x] 6.7 Commit with Conventional Commit and push if remote access is available.

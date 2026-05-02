## Context

The first bootstrap delivered a stateless Next.js dashboard with mock paipan, custom endpoint support, shenjige form encoding, rule-based scoring, optional BYOK LLM narration, export actions, and tests. The remaining public-demo risk is that the shenjige response has not been validated against a real response and the UI/docs still need to make provider and LLM boundaries unmistakable for reviewers.

## Goals / Non-Goals

**Goals:**

- Preserve the bootstrap architecture and extend it through a new OpenSpec change.
- Run one anonymous live shenjige calibration request locally without recording secrets or full raw response data.
- Keep schemas and normalization compatible with both `sample-paipan.json` and any observed shenjige response differences.
- Add tests before behavior changes and keep report generation deterministic without an LLM.
- Make public demo copy operational and clear: Mock Demo needs no key, LLMs explain only, and real provider limitations are visible before submission.
- Document collaboration and deployment paths without enabling dangerous server deployment.

**Non-Goals:**

- No real user data collection.
- No persisted API keys or report history.
- No lunar conversion, overseas timezone conversion, or true-solar-time coordinate math in this change.
- No live server deployment or domain binding in this change.
- No replacement of rule-based scoring with LLM or provider-derived total scores.

## Design Decisions

1. **SDD before code**
   - This change adds proposal, design, task list, spec deltas, and test-matrix traceability before implementation edits.
   - The bootstrap change remains readable during the work so the MVP acceptance surface is not lost.

2. **TDD for provider calibration**
   - Add focused unit/API tests for normalized shenjige responses, missing optional fields, malformed payloads, unsupported lunar calendar, unsupported unknown gender, and true-solar-time prompting.
   - Tests use mock or sanitized minimal fixtures. The full live provider response is never committed.

3. **Secret-safe live request**
   - The live calibration request uses anonymous development birth input with no real name, address, email, or phone.
   - API keys are read only from local environment or explicit runtime input and are never printed, written, or included in docs.
   - The recorded outcome is limited to field-presence summary and implementation implications.

4. **Compatible response normalization**
   - `PaipanResponse` stays the internal contract.
   - If shenjige omits optional fields or uses alternate shapes, Zod schemas accept the minimum safe structure and normalization fills report-safe defaults where possible.
   - Malformed structures produce clear errors before scoring.

5. **LLM explanation boundary**
   - UI and docs state that DeepSeek and OpenAI-compatible providers only explain existing paipan and rule-based scores.
   - Without a real paipan endpoint, the demo uses the anonymous sample chart rather than asking the LLM to create one.

6. **Deployment as documented opt-in**
   - GitHub Actions CI stays active for validation.
   - Server auto-deploy is added only as a disabled/manual template with documented secrets and no automatic push-to-server behavior.

## Test Strategy

- **Unit:** shenjige response normalization, missing optional fields, malformed response rejection, Markdown/JSON disclaimer coverage.
- **API/provider:** unsupported lunar input and unknown gender return clear errors before network calls; true-solar-time without coordinates returns a prompt/warning path and does not block Mock Demo.
- **E2E:** Mock Demo one-click flow renders report stages, dimension explanations, product language, raw JSON, export actions, and disclaimers on desktop/mobile where practical.
- **STT:** Run `openspec validate --all --strict --no-interactive`, `pnpm lint`, `pnpm test`, `pnpm build`, and `pnpm test:e2e` before commit.

## Risks / Trade-offs

- Live shenjige availability or credentials may be unavailable locally; if so, record the environment limitation in devlog and handoff without fabricating calibration results.
- Broader schema compatibility can hide provider drift; tests should cover malformed responses so invalid data fails loudly.
- More UI copy can clutter the dashboard; use concise product UI language and keep report sections scannable.

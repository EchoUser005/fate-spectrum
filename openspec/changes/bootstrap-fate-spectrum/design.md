## Context

Fate Spectrum starts as a new open-source, stateless web application. Users bring birth data and optional provider keys; the app calls a paipan provider, normalizes the resulting BaZi/Ziwei JSON, computes rule-based multidimensional scores, optionally asks an LLM to write narrative explanations, and renders an inspectable dashboard. The repository must be recoverable by future Codex sessions through OpenSpec, AGENTS.md, ADRs, devlogs, handoffs, and tests.

## Goals / Non-Goals

**Goals:**

- Ship a local-first Next.js App Router application that can generate a complete mock report without any key.
- Keep all request and response contracts typed with Zod.
- Make scoring rule-based, deterministic, explainable, and unit-tested.
- Support BYOK DeepSeek and OpenAI-compatible LLM adapters for narrative text only.
- Support a custom paipan endpoint with SSRF protections and a shenjige-compatible form mapping.
- Provide Chinese-first spectrum dashboard views, JSON/Markdown export, CI, Docker, Vercel, and collaborator documentation.

**Non-Goals:**

- No database, login system, payment system, user account, or persistent report history in the MVP.
- No complete in-house BaZi/Ziwei paipan algorithm in the MVP.
- No medical, legal, financial, or psychological diagnosis.
- No PDF export, multilingual UI, custom domain automation, or production server CD pipeline in the MVP.

## Decisions

1. **Next.js App Router with stateless API routes**
   - Use App Router because it keeps page UI and API routes in one deployable project and works well on Vercel and Docker.
   - Alternative: split frontend/API services. Rejected because the MVP does not need microservices.

2. **Zod schemas at every JSON boundary**
   - Birth input, provider config, paipan response, normalized paipan, and report response are validated before use.
   - Alternative: TypeScript-only types. Rejected because runtime provider payloads are untrusted.

3. **Provider abstraction instead of local paipan algorithm**
   - Mock provider enables demos and tests. Custom provider supports user-owned endpoints. The shenjige mapping is implemented as a custom-provider mode triggered by that endpoint.
   - Alternative: implement full paipan logic. Rejected as out of scope and difficult to validate quickly.

4. **Rule-based scoring owns all numeric values**
   - Scoring configuration lives with dimension definitions and engine rules. LLM adapters receive already computed scores and can only return narrative JSON.
   - Alternative: let LLM infer scores. Rejected because it is non-deterministic and hard to test.

5. **BYOK keys are per-request only**
   - API keys are never stored, logged, placed in fixtures, or exposed through NEXT_PUBLIC variables. Optional sessionStorage remains disabled by default.
   - Alternative: server-side stored keys. Rejected because the MVP has no auth or database boundary.

6. **Markdown and JSON export are client-side safe artifacts**
   - Export uses the generated report object, includes disclaimers, and does not include hidden secrets.
   - Alternative: server-generated PDF. Deferred to later roadmap.

7. **OpenSpec bootstrap remains unarchived initially**
   - The bootstrap change stays visible as the active traceability surface until the first public demo is reviewed. The devlog and handoff explain the archive decision.
   - Alternative: archive immediately. Deferred to preserve a clear MVP checklist during first-run validation.

## Risks / Trade-offs

- Real shenjige response shape may differ from the sample contract -> normalize defensively and document response mapping as a P0 calibration task.
- LLM JSON may be malformed -> safe JSON extraction and rule-based fallback narratives.
- Custom endpoints can be abused for SSRF -> block insecure protocols, localhost, and private IP ranges unless explicitly allowed for local development.
- Birth calendar/timezone/truth solar time support is incomplete -> preserve fields, warn in UI/docs, and keep real provider calls solar-first.
- Playwright browser binaries may be unavailable in CI/local environments -> keep E2E spec present and run it through a separate command when browsers are installed.

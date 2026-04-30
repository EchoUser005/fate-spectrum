## Why

Fate Spectrum needs a recoverable, open-source foundation that turns BaZi and Ziwei paipan JSON into explainable multidimensional life spectra rather than a single deterministic score. The first version must be usable with mock data, safe for BYOK model usage, and structured so future contributors can continue through OpenSpec, TDD, ADRs, and handoff files.

## What Changes

- Create a Next.js App Router dashboard for generating and viewing an explainable life spectrum report.
- Add typed schemas for birth input, provider configuration, paipan responses, normalized paipan data, and report output.
- Add paipan provider adapters for mock data and custom external endpoints, including the shenjige form-encoded mapping.
- Add BYOK LLM adapters for DeepSeek and OpenAI-compatible chat completion APIs, limited to narrative generation.
- Add a rule-based scoring engine for dayun, yearly windows, and seven spectrum dimensions.
- Add export support for JSON and Markdown reports.
- Add security controls for API key handling, SSRF prevention, body limits, and professional-advice disclaimers.
- Add documentation, ADRs, test matrix, CI, Docker/Vercel deployment files, and Codex handoff context.
- Add unit and E2E test coverage for core schemas, normalization, scoring, safe JSON extraction, and the mock demo flow.

## Capabilities

### New Capabilities

- `product`: Product identity, positioning, collaboration expectations, and recoverable development workflow.
- `report-generation`: End-to-end report generation from birth input and paipan JSON to spectrum report.
- `scoring-engine`: Rule-based, explainable multidimensional scoring for dayun and yearly windows.
- `paipan-provider`: Mock and custom paipan provider behavior, including shenjige request mapping and SSRF protections.
- `llm-provider`: BYOK LLM narrative generation that cannot own scoring or fabricate paipan data.
- `ui-dashboard`: Chinese-first dashboard behavior for input, generation status, visualization, and report inspection.
- `export`: JSON and Markdown export behavior for generated reports.
- `security`: API key, logging, endpoint, disclaimer, and prompt-injection boundaries.
- `deployment`: Local, Vercel, Docker, and CI validation behavior.

### Modified Capabilities

- None.

## Impact

- Adds a new Next.js/TypeScript application with Tailwind CSS, shadcn-style UI primitives, Recharts, Zod, React Hook Form, Vitest, Playwright, Docker, GitHub Actions, and OpenSpec.
- Adds API routes for health checks, paipan generation, and report generation.
- Adds documentation and operational files required for multi-person Codex collaboration.
- No database, authentication, payment system, or persistent user report storage is introduced in the MVP.

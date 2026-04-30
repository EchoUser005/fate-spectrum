# AGENTS.md

Fate Spectrum · 命运光谱 is an open-source Next.js dashboard that turns BaZi/Ziwei paipan JSON into explainable multidimensional life spectra. It avoids single total scores and deterministic claims; all product language should emphasize spectrum, 光谱, 色阶, 维度, 显影, 分层, and energy distribution.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives
- Zod, React Hook Form, Recharts, lucide-react
- Vitest, Playwright, ESLint, Prettier
- OpenSpec, ADRs, Dev Log, Handoff, GitHub Actions
- Stateless API routes; no database, auth, or payment in MVP

## Key Directories

- `src/app/`: App Router pages and API routes
- `src/components/`: dashboard and UI components
- `src/lib/schemas/`: runtime contracts
- `src/lib/paipan/`: provider adapters and normalization
- `src/lib/scoring/`: deterministic scoring engine
- `src/lib/llm/`: BYOK LLM narrative adapters
- `src/lib/export/`: JSON and Markdown export
- `openspec/changes/bootstrap-fate-spectrum/`: active bootstrap change
- `docs/adr/`, `docs/devlog/`, `docs/handoff/`: durable project memory

## Commands

- Run: `pnpm dev`
- Lint: `pnpm lint`
- Test: `pnpm test`
- E2E: `pnpm test:e2e`
- Build: `pnpm build`
- OpenSpec: `openspec validate --all --strict --no-interactive`

## Read Before Any Code Change

- `AGENTS.md`
- `README.md`
- `TODO.md`
- `openspec/specs/`
- `openspec/changes/` unarchived changes
- `docs/adr/`
- `docs/devlog/latest.md`
- `docs/handoff/latest.md`

## Update After Every Completed Change

- OpenSpec change `tasks.md` checkbox
- `docs/devlog/latest.md`
- `docs/handoff/latest.md`
- `CHANGELOG.md`
- `TODO.md` if follow-ups changed

## Required Workflow

- New features MUST create or update an OpenSpec change before implementation.
- Complex features MUST have proposal/design/tasks/spec deltas before code.
- Core business rules MUST have unit tests.
- API contracts MUST have schemas and tests.
- Completed OpenSpec changes MUST be archived or have a clear unarchived reason.
- Use Conventional Commits, for example `feat(scoring): add rule-based spectrum engine`.
- Before commit run:
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`
  - `openspec validate --all --strict --no-interactive`
- If a command fails for environment reasons, record the command, error summary, and remaining work in `docs/devlog/latest.md`.

## Safety Rules

- Never store, log, fixture, or document real user API keys.
- Never place user API keys in `NEXT_PUBLIC_` variables.
- LLM output MUST NOT be the sole source of scoring numbers.
- LLM adapters only explain and polish; they do not fabricate paipan or alter scores.
- Scoring MUST remain rule-based, testable, and explainable.
- Custom paipan endpoints MUST preserve SSRF protections by default.
- Health, wealth, legal, and psychological language MUST include professional-advice boundaries.

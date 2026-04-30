## 1. Repository Setup

- [x] 1.1 Initialize local git repository and record GitHub CLI availability.
- [x] 1.2 Add package, TypeScript, Next.js, Tailwind, ESLint, Prettier, Vitest, and Playwright configuration.
- [x] 1.3 Add environment example, gitignore, license, Docker, Compose, Vercel, and CI configuration.

## 2. OpenSpec and Project Memory

- [x] 2.1 Create bootstrap proposal, design, specs, and task traceability.
- [x] 2.2 Add AGENTS.md with required read-before-change, update-after-change, safety, and commit rules.
- [x] 2.3 Add README, CONTRIBUTING, docs, ADRs, devlog, handoff, roadmap, security, deployment, and test matrix.
- [x] 2.4 Add CHANGELOG and TODO with user-owned follow-up items.

## 3. Domain Contracts and Fixtures

- [x] 3.1 Implement Zod schemas for birth input, provider config, paipan, normalized paipan, and report response.
- [x] 3.2 Add anonymous sample paipan and sample report fixtures.
- [x] 3.3 Implement paipan normalization for complete and incomplete provider responses.

## 4. Providers and Security

- [x] 4.1 Implement mock paipan provider.
- [x] 4.2 Implement custom paipan provider with HTTPS and SSRF protections.
- [x] 4.3 Implement shenjige form-encoded request mapping and MVP input limitations.
- [x] 4.4 Implement BYOK DeepSeek and OpenAI-compatible LLM adapters with safe fallback behavior.
- [x] 4.5 Implement safe JSON extraction and secret-safe error handling.

## 5. Scoring and Export

- [x] 5.1 Implement dimension definitions and rule configuration.
- [x] 5.2 Implement ganzhi helpers, dayun scoring, yearly scoring, engine orchestration, and explanations.
- [x] 5.3 Implement Markdown and JSON export utilities with disclaimers.

## 6. API and Dashboard

- [x] 6.1 Implement /api/health, /api/paipan, and /api/report routes.
- [x] 6.2 Implement birth and provider forms with validation.
- [x] 6.3 Implement report dashboard sections, charts, heatmap, tables, palace grid, raw JSON viewer, and exports.
- [x] 6.4 Implement Chinese-first spectrum visual language and required disclaimers.

## 7. Tests and Validation

- [x] 7.1 Add unit tests for schemas, normalization, scoring, and safe JSON extraction.
- [x] 7.2 Add Playwright E2E spec for the mock report flow.
- [x] 7.3 Run openspec validate and fix failures.
- [x] 7.4 Run pnpm lint and fix failures.
- [x] 7.5 Run pnpm test and fix failures.
- [x] 7.6 Run pnpm build and fix failures.

## 8. Git and Handoff

- [x] 8.1 Update devlog, handoff, tasks, changelog, and TODO after implementation.
- [x] 8.2 Commit with Conventional Commit message.
- [x] 8.3 Push if GitHub CLI/remote access is available; otherwise document exact user commands.

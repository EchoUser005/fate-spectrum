# Contributing

Thanks for helping Fate Spectrum grow carefully.

## Branches

- `feature/<openspec-change-id>` for new capabilities
- `fix/<issue-or-bug>` for defects
- `chore/<task>` for tooling or documentation

## Workflow

1. Read `AGENTS.md`, `README.md`, `TODO.md`, `docs/devlog/latest.md`, `docs/handoff/latest.md`, and active OpenSpec changes.
2. Create or update an OpenSpec change before implementation.
3. Add tests for core business rules and API contracts.
4. Update the active change `tasks.md`, devlog, handoff, changelog, and TODO.
5. Run `openspec validate --all --strict --no-interactive`, `pnpm lint`, `pnpm test`, and `pnpm build`.
6. Commit with Conventional Commits.

## Pull Requests

Keep PRs scoped to one change. Include validation commands and any environment limitations. Do not include real API keys, private birth data, or provider secrets.

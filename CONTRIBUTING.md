# Contributing

Thanks for helping Fate Spectrum grow carefully.

## Before Development

1. Read `README.md`, `CHANGELOG.md`, and the relevant source files before making a change.
2. Keep changes focused and avoid committing private data, local handoff notes, or tool-specific workspace files.
3. For larger changes, open an issue first so the scope and user experience can be reviewed.

## Branch Naming

- `feature/<change-id>` for new capabilities.
- `fix/<issue>` for defects.
- `chore/<task>` for docs, tooling, or maintenance.

## Testing Rules

- Core business logic must have unit tests.
- API contracts must have schema or route-level tests.
- Provider fixtures must be anonymous and minimal.
- Never commit real API keys, private birth data, or full live provider responses.

## Required Validation

Run these before opening or updating a PR:

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

If a command cannot run because of the local environment, include the command and reason in the PR.

## Pull Requests

Every PR must include:

- Scope of changes.
- Test results.
- Known risks.
- Screenshots or recordings when UI changes are included.

Keep PRs focused. Use Conventional Commits for commit messages.

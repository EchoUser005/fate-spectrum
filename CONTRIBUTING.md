# Contributing

Thanks for helping Fate Spectrum grow carefully.

## Before Development

1. Read `AGENTS.md` before any code change.
2. Read `README.md`, `TODO.md`, `CHANGELOG.md`, `docs/devlog/latest.md`, `docs/handoff/latest.md`, `docs/test-matrix.md`, `docs/adr/`, and active OpenSpec changes.
3. Create a new OpenSpec change before implementing a new feature or complex behavior change.

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
openspec validate --all --strict --no-interactive
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

If a command cannot run because of the local environment, record the command and reason in `docs/devlog/latest.md` and `docs/handoff/latest.md`.

## Pull Requests

Every PR must include:

- OpenSpec change id.
- Scope of changes.
- Test results.
- Known risks.
- Screenshots or recordings when UI changes are included.

Keep PRs focused on one OpenSpec change. Use Conventional Commits for commit messages.

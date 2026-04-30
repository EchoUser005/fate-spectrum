# Deployment

## GitHub Actions CI

The active CI workflow is `.github/workflows/ci.yml`.

It runs on pushes and pull requests to `main`:

```bash
pnpm install --frozen-lockfile
npm install -g @fission-ai/openspec@latest
openspec validate --all --strict --no-interactive
pnpm lint
pnpm test
pnpm build
```

E2E is intentionally kept as a local/manual validation command for now because Playwright browser installation can vary by runner.

## Local

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Vercel Manual Import

1. Open Vercel and import `EchoUser005/fate-spectrum`.
2. Keep the framework preset as Next.js.
3. Use the default install command:

```bash
pnpm install --frozen-lockfile
```

4. Use the build command:

```bash
pnpm build
```

5. Deploy without adding site-owned LLM keys. Fate Spectrum is BYOK and accepts user keys per request only.

## Docker Compose

```bash
docker compose up -d --build
```

Default port: `3000`.

Health check:

```bash
curl http://127.0.0.1:3000/api/health
```

## Custom Domain

Domain binding is intentionally left to the maintainer. Add the domain in Vercel or the chosen hosting layer after the GitHub repository and deployment target are ready.

## Future Server Auto-Deploy

Server auto-deploy is not enabled for public demo hardening. A guarded manual template exists at `.github/workflows/server-deploy.disabled.yml`.

Do not enable automatic server deployment until the server is hardened, rollback is documented, and secrets are configured.

Reserved GitHub Secrets:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PORT`
- `DEPLOY_PATH`
- `SSH_PRIVATE_KEY`

The current public demo review does not require server information.

## Environment Variables

See `.env.example`. Do not put user keys in `NEXT_PUBLIC_`.

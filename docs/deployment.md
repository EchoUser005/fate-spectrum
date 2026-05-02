# Deployment

## GitHub Actions CI

The active CI workflow is `.github/workflows/ci.yml`.

It runs on pushes and pull requests to `main`:

```bash
pnpm install --frozen-lockfile
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

## Optional Conda Environment

Use this when developing the future Python calendar/AI backend beside the Next.js app:

```bash
conda create -n fate-spectrum python=3.12 -y
conda activate fate-spectrum
```

The current public app does not require Python at runtime.

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

## Environment Variables

See `.env.example`. Do not put user keys in `NEXT_PUBLIC_`.

Prompts are versioned locally in `prompts/` and work without any prompt server. Optional Langfuse prompt management uses server-only variables:

```env
LANGFUSE_BASE_URL=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_PROMPT_LABEL=production
```

Keep these values in deployment secrets or a local `.env.local` file only. Do not commit real Langfuse hosts, public keys, secret keys, traces, or private prompt payloads.

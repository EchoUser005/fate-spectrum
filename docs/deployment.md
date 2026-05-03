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

The Next.js app can run without Python. Docker Compose includes the optional FastAPI memory service for private JSON/Markdown persistence.

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

No `.env` file is required for a first boot. Docker Compose uses safe defaults from `docker-compose.yml`; a local `.env` can override them when needed.

```bash
docker compose up -d --build
```

Default app port: `3000`.
Default memory API port: `8000`.

Health check:

```bash
curl http://127.0.0.1:3000/api/health
curl http://127.0.0.1:8000/health
```

Runtime data is stored in the named volume `fate-spectrum-data`. The image build context excludes `.env`, `data/`, `.git/`, test reports, and local workspace files through `.dockerignore`.

To remove containers only:

```bash
docker compose down
```

To remove the private local data volume too:

```bash
docker compose down -v
```

## Custom Domain

Domain binding is intentionally left to the maintainer. Add the domain in Vercel or the chosen hosting layer after the GitHub repository and deployment target are ready.

## Environment Variables

See `.env.example`. Do not put user model keys in `.env`, deployment secrets, or `NEXT_PUBLIC_` variables for the public BYOK app. Users enter model keys in the browser when generating a report; the backend treats them as request-only data.

Prompts are versioned locally in `prompts/` and work without any prompt server. Optional Langfuse prompt management uses server-only variables:

```env
LANGFUSE_BASE_URL=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_PROMPT_LABEL=prod
```

Keep these values in deployment secrets or a local `.env.local` file only. Do not commit real Langfuse hosts, public keys, secret keys, traces, or private prompt payloads.

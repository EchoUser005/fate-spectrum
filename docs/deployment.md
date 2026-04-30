# Deployment

## Local

```bash
pnpm install
pnpm dev
```

## Vercel

Import the GitHub repository and use defaults:

- Install: `pnpm install --frozen-lockfile`
- Build: `pnpm build`
- Output: Next.js

The app is BYOK and does not need a global LLM key.

## Docker

```bash
docker compose up -d
```

Default port: `3000`.

## Custom Domain

Domain binding is intentionally left to the user. Add the domain in Vercel or the chosen hosting layer after the GitHub repository is available.

## Environment Variables

See `.env.example`. Do not put user keys in `NEXT_PUBLIC_`.

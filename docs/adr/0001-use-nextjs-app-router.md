# ADR 0001: Use Next.js App Router

## Status

Accepted

## Context

The MVP needs a web dashboard, API routes, Vercel deployment, Docker deployment, and fast contributor onboarding.

## Decision

Use Next.js App Router with TypeScript.

## Alternatives

- Vite SPA plus separate API: more deployment pieces.
- Full backend framework: unnecessary for stateless MVP.

## Consequences

Frontend and API contracts live in one repository and can deploy to Vercel or Docker. API routes must stay stateless.

## Follow-up

Review dependency versions before public demo.

# Prompt Registry

This directory is the local source of truth for Fate Spectrum prompts.

Prompts are versioned with GitHub so the open-source project can run without a prompt management server. Runtime Langfuse integration is optional: when server-only Langfuse environment variables are present, the app can fetch the managed prompt; when they are absent or unreachable, the app falls back to the matching local prompt in this directory.

Do not commit real Langfuse hosts, public keys, secret keys, model keys, user birth data, provider responses, or generated private reports.

## Prompts

- `fate-spectrum-narrative.v1.json`: chat prompt for report narrative generation.

## Template Variables

- `{{context}}`: JSON string containing normalized chart data, deterministic scores, output shape, and required disclaimers.

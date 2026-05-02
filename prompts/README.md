# Prompt Registry

This directory is the local source of truth for Fate Spectrum prompts.

Prompts are versioned with GitHub so the open-source project can run without a prompt management server. Runtime Langfuse integration is optional: when server-only Langfuse environment variables are present, the app can fetch the managed prompt; when they are absent or unreachable, the app falls back to the matching local prompt in this directory.

Do not commit real Langfuse hosts, public keys, secret keys, model keys, user birth data, provider responses, or generated private reports.

## Prompts

- `fate-spectrum-narrative.v1.json`: chat prompt for report narrative generation.
- `fate-spectrum-narrative.v2.json`: structured report-editor prompt for 日主、命盘格局、喜用神、忌神、当下大环境, using sanitized runtime context and deterministic score rows.
- `fate-spectrum-overview.v1.json`: overview-only prompt for 日主、命盘格局、喜用神、忌神、当下大环境.
- `fate-spectrum-dimensions.v1.json`: seven-dimension interpretation prompt.
- `fate-spectrum-windows.v1.json`: key windows and action-plan prompt.

## Sync to Langfuse

Runtime lookup prefers Langfuse when server-only `LANGFUSE_BASE_URL`, `LANGFUSE_PUBLIC_KEY`, and `LANGFUSE_SECRET_KEY` are configured, and falls back to the local files when Langfuse is unavailable.

To publish local prompt files to the `production` label:

```bash
LANGFUSE_BASE_URL=... LANGFUSE_PUBLIC_KEY=... LANGFUSE_SECRET_KEY=... pnpm prompts:sync
```

Use `LANGFUSE_PROMPT_LABEL=staging` to sync to another label. Do not wire this command to `dev` or `build`; prompt publication should be explicit.

## Template Variables

- `{{context}}`: JSON string containing normalized chart data, deterministic scores, output shape, and required disclaimers.

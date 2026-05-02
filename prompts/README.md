# Prompt Registry

Local prompts live under:

```text
prompts/fate-spectrum/<ai-function>/
  prompt.json
  system.md
  user.md
```

Runtime behavior:

1. If `LANGFUSE_BASE_URL` or `LANGFUSE_HOST`, `LANGFUSE_PUBLIC_KEY`, and `LANGFUSE_SECRET_KEY` are configured on the server, Fate Spectrum fetches the Langfuse prompt with `LANGFUSE_PROMPT_LABEL` or `prod`.
2. If that prompt exists in Langfuse, Langfuse wins even when local files differ.
3. If Langfuse is reachable but a local prompt is missing in Langfuse, the app seeds the missing prompt once with the `prod` label.
4. If Langfuse is not configured or unavailable, the app uses these local files.

Current prompt functions:

- `overview`: 日主、命盘格局、喜用神、忌神。
- `current-environment`: 当前大运与流年环境，独立于总览。
- `dimensions`: 七个维度解释。
- `windows`: 关键年份窗口和行动建议。
- `weekly-daily`: 周报流日。
- `monthly-rollup`: 周报沉淀到月报。
- `yearly-memory`: 月报沉淀到年度记忆。

Publish local prompts to Langfuse:

```bash
LANGFUSE_BASE_URL=... LANGFUSE_PUBLIC_KEY=... LANGFUSE_SECRET_KEY=... pnpm prompts:sync
```

Pull `prod` prompts from Langfuse back to local files:

```bash
LANGFUSE_BASE_URL=... LANGFUSE_PUBLIC_KEY=... LANGFUSE_SECRET_KEY=... pnpm prompts:pull
```

Do not commit real Langfuse hosts, keys, model keys, user birth data, provider responses, traces, or generated private reports.

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
5. Each LLM report generation writes a Langfuse trace when tracing is enabled; prompt modules are stored as separate generations under the same trace.

Current prompt functions:

- `portrait`: 格局画像，输出 tags 和 summary。
- `overview`: 旧版总览文案兼容层。
- `element-energy`: 五行/十神能量谱，把喜用与忌神转为可解释量化节点。
- `current-environment`: 当前大运与流年环境，独立于总览。
- `dimensions`: 七个维度解释。
- `windows`: 关键年份窗口和行动建议。
- `daily-guidance`: 每日流日提示。
- `daily-feedback-summary`: 晚间反馈结构化摘要。
- `weekly-daily`: 周报流日。
- `monthly-rollup`: 周报沉淀到月报。
- `yearly-memory`: 月报沉淀到年度记忆。
- `adaptive-score-candidate`: 记忆证据到自适应评分候选，不能直接改分。
- `relationship-context`: 命主与缘主互动上下文。

The P0 release path is `portrait`, `element-energy`, and `current-environment`. These prompts include anonymous shot examples using `壬申 己酉 戊申 未知` so Langfuse tuning starts from a visible product-style baseline without committing private chart data.

Check local and remote prompt status:

```bash
pnpm prompts:check
```

Seed only missing prompts to Langfuse:

```bash
pnpm prompts:seed
```

Publish local prompts to Langfuse:

```bash
LANGFUSE_BASE_URL=... LANGFUSE_PUBLIC_KEY=... LANGFUSE_SECRET_KEY=... pnpm prompts:sync
```

Pull `prod` prompts from Langfuse back to local files:

```bash
LANGFUSE_BASE_URL=... LANGFUSE_PUBLIC_KEY=... LANGFUSE_SECRET_KEY=... pnpm prompts:pull
```

Do not commit real Langfuse hosts, keys, model keys, user birth data, provider responses, traces, or generated private reports.

Trace privacy defaults:

```env
LANGFUSE_TRACE_ENABLED=true
LANGFUSE_TRACE_CONTENT=redacted
```

`redacted` hides name, nickname, birth date, birth time, birth place, city, email, phone, and other direct identifiers from trace inputs while preserving chart structure and generated outputs for prompt tuning. Use `full` only in a trusted local Langfuse environment.

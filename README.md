# Fate Spectrum · 命运光谱

不是一个笼统总分，而是一组可解释的人生维度光谱。

Fate Spectrum is an open-source life rhythm dashboard. It accepts birth input and BYOK provider configuration, computes rule-based multidimensional scores from paipan data, and renders an outcome-first spectrum report with source data kept in an advanced panel.

## Screenshot

![Fate Spectrum OG](./public/og.png)

## Features

- Mock Demo sample paipan with no key required
- Custom paipan endpoint support, including the shenjige form-encoded mapping
- Rule-based scoring for wealth, career, comfort, selfValue, relationship, healthEnergy, and riskControl
- Optional DeepSeek V4 or OpenAI-compatible narrative generation
- Outcome summary, action plan, timing windows, radar spectrum, dayun spectrum, yearly color scale, line chart, heatmap
- Advanced source panel for BaZi pillars, Ziwei palace grid, and raw JSON
- JSON and Markdown export
- OpenSpec, ADRs, devlog, handoff, test matrix, CI, Docker, Vercel

## Why Fate Spectrum

The project does not frame a life as one line or one total score. It treats paipan output as a multidimensional spectrum: different dimensions brighten, fade, and require different kinds of action or risk control.

## Local Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Mock Demo

Select `Mock Demo · 样例星盘`, keep the default birth input, and click `生成我的命盘光谱`. No API key is needed.

## DeepSeek Key

Enable LLM explanation, choose `DeepSeek`, enter a model and key. Default model is `deepseek-v4-flash`; `deepseek-v4-pro` is also available. DeepSeek only writes explanation text from existing paipan JSON and rule-based scores. It does not calculate scores or fabricate a chart.

Apply for a key at `https://platform.deepseek.com` and check current model names at `https://api-docs.deepseek.com/`.

LLM keys are cached only in browser `sessionStorage` for the current session and can be cleared from the UI.

## OpenAI-Compatible Custom

Enable LLM explanation, choose `OpenAI-compatible Custom`, then enter a compatible base URL, model, and key. The app calls `<baseUrl>/chat/completions`.

## Custom Paipan

Choose `Custom Paipan` and provide an HTTPS endpoint. For `https://www.shenjige.cn/api/ziwei/getPlateArrangement`, the provider sends form data:

- `year`, `month`, `day`
- `hour`, `h`, `m`
- `genderValue`
- `settings[sihua]`, `settings[brightness]`, `settings[isShowDStarBright]`, `settings[JKXK]`, `settings[RYType]`, `settings[RYTypeM45]`
- `zzpAnalysis`

MVP real-provider limitations: solar calendar only, `male` or `female` only, timezone and birthPlace preserved but not converted, overseas timezone conversion deferred, true solar time currently preserves the switch and prompt only.

## OpenSpec Workflow

Develop new feature:

```bash
/opsx:propose <feature>
```

Implement:

```bash
/opsx:apply
```

Validate:

```bash
openspec validate --all --strict --no-interactive
pnpm lint
pnpm test
pnpm build
```

Archive:

```bash
/opsx:archive
```

## Codex Workflow

Before edits, read `AGENTS.md`, `README.md`, active OpenSpec changes, ADRs, `docs/devlog/latest.md`, `docs/handoff/latest.md`, and `TODO.md`. After edits, update the active tasks, devlog, handoff, changelog, and TODO.

## Development Commands

```bash
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
openspec validate --all --strict --no-interactive
```

## Deploy to Vercel

Import `EchoUser005/fate-spectrum` in Vercel. The default build command is `pnpm build`. This BYOK app does not require a site-owned LLM key.

## Docker

```bash
docker compose up -d
```

The app listens on port `3000`.

## Security

- User API keys are BYOK and per-request.
- Keys are not stored on the backend, logged, exported, or exposed through `NEXT_PUBLIC_`.
- Optional LLM key convenience cache uses browser `sessionStorage` only and can be cleared from the UI.
- Custom paipan endpoints are HTTPS-only and block localhost/private IPs unless explicitly allowed for local development.
- LLM prompts treat provider output as untrusted context.

## Disclaimer

本工具输出属于传统命理与模型生成内容，仅供自我反思、娱乐和规划参考，不构成医疗、法律、投资、心理诊断或其他专业建议。

健康能量维度不是医学诊断。如有身体不适，请咨询具备资质的医疗专业人士。

财富量级维度不是投资建议，不构成买卖任何资产或金融产品的依据。

## Roadmap

- MVP: mock report, custom paipan, rule scoring, dashboard, export, CI
- v0.2: calibrate real provider mappings and richer scoring rules
- v0.3: PDF export and stronger visual QA
- v1.0: public demo, stable provider contracts, collaborator docs

## License

MIT

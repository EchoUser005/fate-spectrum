# 命运光谱

不是一个笼统总分，而是一组可解释的人生维度光谱。

Fate Spectrum is an open-source life rhythm dashboard. It accepts birth input, requests real paipan data, computes deterministic multidimensional scores, and renders a Chinese-first visual report. Source details stay in docs/tests rather than the ordinary product UI.

## Screenshot

![Fate Spectrum OG](./public/og.png)

## Features

- 生辰配置 + 模型配置 in one direct workbench
- Real paipan generation through a server-side provider path
- Rule-based scoring for wealth, career, comfort, selfValue, relationship, healthEnergy, and riskControl
- Required DeepSeek V4 narrative generation for interpreted reports; scores remain deterministic and are not changed by the model
- Visual report shell with 总览, 大运, 流年, 星盘, and 详细解读
- Golden sample score regression aligned to the original Excel-style report target
- Dayun spectrum curve, dayun color scale, dayun score table, yearly focus table
- BaZi pillars and Ziwei palace summary without raw source data in the product UI
- Markdown export
- CI, Docker, and Vercel-ready deployment

## Why Fate Spectrum

The project does not frame a life as one line or one total score. It treats paipan output as a multidimensional spectrum: different dimensions brighten, fade, and require different kinds of action or risk control.

## Local Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

The app starts on the initialization page. After generating a primary report, it saves the primary profile locally in the browser and opens `/chart`. Returning to `/` will reuse the saved primary profile until it is cleared from the chart page.

## DeepSeek Key

Enter a model key in 模型配置 before generating a report. The default model is `deepseek-v4-pro`; `deepseek-v4-flash` and `deepseek-chat` remain selectable model names. DeepSeek writes explanation text from existing paipan data and deterministic scores. It does not calculate scores or fabricate a chart.

Apply for a key at `https://platform.deepseek.com` and check current model names at `https://api-docs.deepseek.com/`.

LLM keys are cached only in browser `sessionStorage` for the current session and can be cleared from the UI.

Server-side prompt management can be connected through Langfuse with `LANGFUSE_BASE_URL`, `LANGFUSE_PUBLIC_KEY`, and `LANGFUSE_SECRET_KEY`. Do not commit real keys.

## Real Paipan

Ordinary report generation uses a server-side paipan provider path. The public UI does not ask users to inspect provider payloads or raw source data.

Current limitations: solar calendar only, `male` or `female` only, timezone and birthPlace preserved but not converted, overseas timezone conversion deferred, true solar time currently preserves the switch and prompt only.

## Development Commands

```bash
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
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
- Model key convenience cache uses browser `sessionStorage` only and can be cleared from the UI.
- Custom paipan endpoints are HTTPS-only and block localhost/private IPs unless explicitly allowed for local development.
- LLM prompts treat provider output as untrusted context.

## Disclaimer

本工具输出属于传统命理与模型生成内容，仅供自我反思、娱乐和规划参考，不构成医疗、法律、投资、心理诊断或其他专业建议。

健康能量维度不是医学诊断。如有身体不适，请咨询具备资质的医疗专业人士。

财富量级维度不是投资建议，不构成买卖任何资产或金融产品的依据。

## Roadmap

- MVP: real paipan path, required model narrative, rule scoring, dashboard, export, CI
- v0.2: calibrate real provider mappings and richer scoring rules
- v0.3: PDF export and stronger visual QA
- v1.0: public demo, stable provider contracts, collaborator docs

## License

MIT

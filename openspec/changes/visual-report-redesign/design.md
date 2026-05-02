## Context

Fate Spectrum currently works as a Next.js dashboard with mock and shenjige-compatible paipan providers, deterministic scoring, optional BYOK LLM narrative, and export. The problem is no longer basic capability; it is product framing. Users are seeing too much source material and implementation detail before they see a readable life-spectrum report.

The redesign follows two constraints:

- The public product UI must speak in report-editor language, not engineering language.
- The original Excel report's spirit must be preserved through golden scoring, clear curves, color scales, and readable tables.

## Visual Thesis

Warm paper, restrained dashboard density, and editorial report hierarchy: a readable Chinese product surface with stable charts, light dividers, and color used only for score meaning.

## Content Plan

1. **Workbench:** `命运光谱`, 生辰配置, 模型配置, and one generate action in the first viewport.
2. **Report:** Excel-like score report with dimension curves, color-scale tables, dayun score instructions, yearly score tables, chart summary, and concise interpretation.
3. **Export / Disclaimer:** concise actions and professional-advice boundaries after the report content.

## Interaction Thesis

- The user starts with the fields they must complete and one obvious primary action.
- Report navigation is sticky and horizontal on small screens so the user can jump between 总览, 大运, 流年, 星盘, and 详细解读.
- Charts and tables get stable responsive containers and internal scrolling; technical/raw data is not exposed in the product UI.

## Product Correction

- Remove sample-experience and sample-report CTA language from the ordinary UI.
- Remove numbered 1/2/3 step framing and `Step` headings.
- Remove `可选` wording from ordinary labels.
- Remove 高级设置 and 高级数据 from the product surface.
- Make model configuration visible enough to use without reading a manual.
- Replace broad headings such as `先看这八步怎么起伏` with report/table headings such as `大运维度评分曲线`.
- Add per-dayun opportunity, risk, and action columns so every score row has an explicit instruction.

## Design Decisions

1. **OpenSpec and TDD first**
   - Add spec deltas and traceability before implementation.
   - Add failing tests for banned copy, golden sample scores, shared chart/table data source, export cleanliness, and responsive E2E behavior.

2. **Information architecture reset**
   - `AppShell` becomes state orchestration only.
   - Component folders separate workbench, report, charts, and UI copy.
   - Model configuration is visible in the workbench; provider/raw-data details are omitted from the product surface.

3. **Dashboard layout without product bloat**
   - Use shadcn dashboard-block density and chart guidance as references, but do not add auth/database/sidebar systems.
   - Keep cards only for report sections and repeated score summaries.
   - Use warm background tokens and the specified dimension/color scale palette.

4. **Golden profile as MVP regression**
   - Add `src/lib/scoring/golden-profiles.ts` for the sample paipan target.
   - If the normalized pillars match `己卯 / 乙亥 / 戊寅 / 癸亥` and the dayun sequence contains `丙子` through `癸未`, override sample dayun scores and summaries.
   - Preserve general scoring rules for non-golden reports; this is demo calibration, not a permanent universal engine.
   - LLM narrative may polish text but never changes scores.

5. **Chart and table consistency**
   - Dayun curve, heatmap, and score table all read from `report.dayunScores`.
   - Default curve dimensions: 财富量级, 生活舒适度, 自我价值成就.
   - Optional toggles expose the remaining four dimensions without crowding the chart.
   - Tables use horizontal scroll containers rather than page overflow.

6. **Export main body is user-facing**
   - Markdown export includes target scores, summaries, and disclaimers.
   - Technical terms are absent from the main export body; developer appendices are optional and clearly separated.

## Test Strategy

- **Unit:** golden sample scores, LLM-on/off score invariance, chart/table source helpers, export copy, provider config defaults.
- **UI copy:** public-facing component strings do not contain banned technical terms or manual-like labels.
- **E2E:** desktop, tablet, and mobile generation; tabs; no advanced data disclosure; export buttons; no horizontal page overflow.
- **Visual review:** Playwright screenshot capture for desktop home, desktop overview, desktop dayun, mobile home, and mobile report.
- **STT:** run OpenSpec validation, lint, unit tests, build, and E2E before commit.

## Risks / Trade-offs

- The golden sample override is intentionally narrow; future expert calibration should replace it with broader rule weights.
- Strong copy filtering can accidentally remove useful contributor affordances; those details should live in docs/tests instead of the product UI.
- Screenshot capture is a first visual guardrail, not full pixel-diff visual regression yet.

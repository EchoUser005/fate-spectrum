## Context

Fate Spectrum currently works as a Next.js dashboard with mock and shenjige-compatible paipan providers, deterministic scoring, optional BYOK LLM narrative, and export. The problem is no longer basic capability; it is product framing. Users are seeing too much source material and implementation detail before they see a readable life-spectrum report.

The redesign follows two constraints:

- The public product UI must speak in report-editor language, not engineering language.
- The original Excel report's spirit must be preserved through golden scoring, clear curves, color scales, and readable tables.

## Visual Thesis

Warm paper, restrained dashboard density, and editorial report hierarchy: a readable Chinese product surface with stable charts, light dividers, and color used only for score meaning.

## Content Plan

1. **Landing / Hero:** `命运光谱`, short promise, two actions, and a compact sample preview.
2. **Wizard:** 生辰信息 -> 解读方式 -> 生成报告, with technical fields folded into advanced settings.
3. **Report:** sticky section navigation, overview-first, dayun and yearly visual analysis, chart summary, detailed reading, and folded developer data.
4. **Export / Disclaimer:** concise actions and professional-advice boundaries after the report content.

## Interaction Thesis

- The user starts with one obvious primary action and can inspect a sample report without filling technical fields.
- Report navigation is sticky and horizontal on small screens so the user can jump between 总览, 大运, 流年, 星盘, 详细解读, and 高级数据.
- Long or technical content uses disclosure controls; charts and tables get stable responsive containers and internal scrolling.

## Design Decisions

1. **OpenSpec and TDD first**
   - Add spec deltas and traceability before implementation.
   - Add failing tests for banned copy, golden sample scores, shared chart/table data source, export cleanliness, and responsive E2E behavior.

2. **Information architecture reset**
   - `AppShell` becomes state orchestration only.
   - New component folders separate marketing, workbench, report, charts, and UI copy.
   - Provider/model/raw-data settings move into `AdvancedSettings` and `DeveloperDataDrawer`.

3. **Dashboard layout without product bloat**
   - Use shadcn dashboard-block density and chart guidance as references, but do not add auth/database/sidebar systems.
   - Keep cards only for report sections, repeated score summaries, and folded developer areas.
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
- **UI copy:** public-facing component strings do not contain banned technical terms outside advanced/developer areas.
- **E2E:** desktop, tablet, and mobile generation; tabs; advanced data disclosure; export buttons; no horizontal page overflow.
- **Visual review:** Playwright screenshot capture for desktop home, desktop overview, desktop dayun, mobile home, and mobile report.
- **STT:** run OpenSpec validation, lint, unit tests, build, and E2E before commit.

## Risks / Trade-offs

- The golden sample override is intentionally narrow; future expert calibration should replace it with broader rule weights.
- Strong copy filtering can accidentally remove useful developer affordances; advanced settings and developer data remain available for contributors.
- Screenshot capture is a first visual guardrail, not full pixel-diff visual regression yet.

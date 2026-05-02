## Why

The second-round public demo hardening made the app functional, but the interface still reads like an engineering workbench. Ordinary users see provider names, raw paipan language, model settings, process internals, and long data sections before they see the product value. The visual layer also drifts away from the original Excel-style score report: users want dimension scores, decade curves, color scales, and clear tables, not a raw provider console.

## What Changes

- Redesign the information architecture around one direct workbench: fill birth information, configure the model, and generate the report.
- Keep ordinary UI Chinese-first and remove technical/source-data disclosures from the product surface.
- Rebuild the report around overview, dayun spectrum, yearly color scale, chart/palace summary, detailed reading, and table-first score outputs.
- Use dashboard-layout patterns inspired by shadcn dashboard blocks and Recharts chart guidance while keeping the MVP stateless.
- Add a golden profile for the sample paipan so the demo report matches the original Excel target scores.
- Add copy, golden scoring, chart-source, export, and responsive E2E tests.
- Capture local Playwright screenshots for design review notes without committing large binary artifacts if they are too heavy.

## Reviewer Correction

The first implementation still felt like a user manual. The next correction removes sample-entry language, numbered steps, optional copy, and all visible advanced/developer data. The ordinary UI becomes a single workbench: fill birth information, configure the model, generate the report, then read Excel-style score tables and charts.

## Reviewer Correction 2

The second review found three product-breaking issues: model mode cards still made the flow feel like a settings exercise, reports could be generated without a model key, and the UI still submitted the mock sample provider so different birth inputs produced the same chart. This correction requires 模型密钥, sends generation through the real paipan provider path, and reduces repeated numeric score cards outside the chart/table areas.

## Capabilities

### Modified Capabilities

- `ui-dashboard`: Single workbench layout, responsive report navigation, clean charts/tables, no advanced-data surface, and banned technical copy rules.
- `report-generation`: Report sections and progress states aligned to user-facing phases instead of engineering internals.
- `scoring-engine`: Sample paipan golden profile regression and traceable scoring outputs.
- `llm-provider`: Direct DeepSeek model-name/key configuration; model narrative is required for interpreted reports and cannot change scores.
- `paipan-provider`: Ordinary report generation uses the real custom/shenjige provider path instead of the mock sample provider.
- `export`: Cleaner user-facing Markdown export without technical terminology in the main body.
- `security`: API keys remain session-only; developer/provider details stay out of public UI and exports.

## Impact

- Touches frontend component structure, copy, chart/table rendering, scoring calibration, exports, tests, and docs.
- Does not add login, database, payment, PDF export, multilingual UI, server deployment, or new external provider behavior.
- Keeps shenjige and raw paipan details in docs/tests only; the ordinary product experience does not expose them.

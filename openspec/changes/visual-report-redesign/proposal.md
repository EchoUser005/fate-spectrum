## Why

The second-round public demo hardening made the app functional, but the interface still reads like an engineering workbench. Ordinary users see provider names, raw paipan language, model settings, process internals, and long data sections before they see the product value. The visual layer also drifts away from the original Excel-style score report: users want dimension scores, decade curves, color scales, and clear tables, not a raw provider console.

## What Changes

- Redesign the information architecture around Landing, a 3-step generation wizard, and a navigable report shell.
- Keep ordinary UI Chinese-first and hide technical terms inside Advanced Settings or Developer Data.
- Rebuild the report around overview, dayun spectrum, yearly color scale, chart/palace summary, detailed reading, and developer data.
- Use dashboard-layout patterns inspired by shadcn dashboard blocks and Recharts chart guidance while keeping the MVP stateless.
- Add a golden profile for the sample paipan so the demo report matches the original Excel target scores.
- Add copy, golden scoring, chart-source, export, and responsive E2E tests.
- Capture local Playwright screenshots for design review notes without committing large binary artifacts if they are too heavy.

## Capabilities

### Modified Capabilities

- `ui-dashboard`: Product-first layout, responsive report navigation, clean charts/tables, advanced-data hiding, and banned technical copy rules.
- `report-generation`: Report sections and progress states aligned to user-facing phases instead of engineering internals.
- `scoring-engine`: Sample paipan golden profile regression and traceable scoring outputs.
- `llm-provider`: DeepSeek V4 model quality modes in advanced settings, with LLM narrative unable to change scores.
- `export`: Cleaner user-facing Markdown export without technical terminology in the main body.
- `security`: API keys and developer/provider details remain hidden from public UI and exports unless explicitly opened in developer areas.

## Impact

- Touches frontend component structure, copy, chart/table rendering, scoring calibration, exports, tests, and docs.
- Does not add login, database, payment, PDF export, multilingual UI, server deployment, or new external provider behavior.
- Keeps shenjige and raw paipan details available for debugging but removes them from the primary product experience.

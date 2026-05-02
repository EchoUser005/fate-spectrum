# Changelog

## [Unreleased]

### Added

- Added OpenSpec workflow.
- Added BYOK LLM provider abstraction.
- Added mock paipan provider.
- Added rule-based scoring engine.
- Added spectrum dashboard UI.
- Added markdown/json export.
- Added custom shenjige-compatible paipan mapping.
- Added CI, Docker, Vercel, ADRs, devlog, handoff, and test matrix.
- Added `public-demo-hardening` OpenSpec change with paipan, report, UI, security, collaboration, and deployment specs.
- Added shenjige normalization, unsupported-input, true-solar-time prompt, and export disclaimer tests.
- Added PR and issue templates plus a disabled/manual server deploy workflow template.
- Added `product-experience-redesign` OpenSpec change for outcome-first public demo UX.
- Added Recharts-backed spectrum radar, action plan, timing window, and advanced source data panels.
- Added DeepSeek V4 model defaults, official key guidance links, and session-only LLM key cache controls.
- Added `visual-report-redesign` OpenSpec change for product IA, visual report redesign, golden scoring, copy hardening, and visual review screenshots.
- Added sample paipan golden profile regression for the original Excel-style eight-step dayun score targets.
- Added report view-model helpers so dayun curve, heatmap, and table share `report.dayunScores`.
- Added UI copy, golden scoring, chart-source, export, and responsive visual E2E coverage.

### Changed

- Calibrated shenjige form mapping to include `h` and `m` fields and numeric `status` response handling.
- Improved public demo copy, generation stages, dimension-first report presentation, mobile E2E coverage, and export disclaimer coverage.
- Expanded deployment and contribution documentation for multi-person collaboration.
- Archived `bootstrap-fate-spectrum` into main OpenSpec specs after MVP acceptance.
- Reworked homepage and report copy away from raw paipan/source-data framing toward user outcomes and next actions.
- Rebuilt the main UI as a Chinese-first product flow: landing, three-step wizard, sticky report navigation, overview, dayun, yearly, chart, detailed reading, and folded developer data.
- Moved technical provider/model/source data into Advanced Settings and Developer Data.
- Changed DeepSeek default to `deepseek-v4-pro` for high-quality interpretation while retaining `deepseek-v4-flash` and `deepseek-chat`.
- Reworked Markdown export into a cleaner user-facing report with target scores and disclaimers.

### Fixed

- Fixed JSON export so exported artifacts include professional-advice disclaimers.

### Security

- Added BYOK boundaries, endpoint SSRF checks, and professional-advice disclaimers.
- Confirmed live shenjige calibration records only field presence and stores no full real response or secrets.

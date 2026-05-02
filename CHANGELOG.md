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

### Changed

- Calibrated shenjige form mapping to include `h` and `m` fields and numeric `status` response handling.
- Improved public demo copy, generation stages, dimension-first report presentation, mobile E2E coverage, and export disclaimer coverage.
- Expanded deployment and contribution documentation for multi-person collaboration.
- Archived `bootstrap-fate-spectrum` into main OpenSpec specs after MVP acceptance.
- Reworked homepage and report copy away from raw paipan/source-data framing toward user outcomes and next actions.

### Fixed

- Fixed JSON export so exported artifacts include professional-advice disclaimers.

### Security

- Added BYOK boundaries, endpoint SSRF checks, and professional-advice disclaimers.
- Confirmed live shenjige calibration records only field presence and stores no full real response or secrets.

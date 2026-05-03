# Changelog

## [Unreleased]

### Added

- Added same-origin Next.js profile API proxy routes for owner/guest memory CRUD.
- Added frontend profile sync that prefers FastAPI report snapshots while keeping local browser storage as fallback.
- Added structured `analysis` report data for reusable Fate context, portrait tags, element energy nodes, and current-environment signals.
- Added `portrait` and `element-energy` prompt functions for independent Langfuse/local prompt tuning.
- Added anonymous shot examples to P0 portrait, element-energy, and current-environment prompts for Langfuse tuning.
- Added Langfuse report-generation tracing with per-prompt generation records, prompt versions, model metadata, usage, outputs, and default redacted inputs.
- Added analysis lifecycle documentation and code constants for profile-init, stable, cycle, daily, and future feedback modules.
- Added environment separation documentation for local/staging/production data and Langfuse endpoint boundaries.
- Added report workspace modals for model configuration and guest chart creation.
- Added `fate-spectrum-narrative-v2` local prompt with structured 日主、命盘格局、喜用神、忌神、当下大环境 overview requirements and current dayun/year context.
- Added split report prompts for overview, seven-dimension reading, and key windows/action plan.
- Added `pnpm prompts:sync` for explicit local prompt publication to Langfuse labels.
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
- Added anonymous sample paipan regression coverage for the eight-step dayun report table.
- Added report view-model helpers so dayun curve, heatmap, and table share `report.dayunScores`.
- Added UI copy, golden scoring, chart-source, export, and responsive visual E2E coverage.
- Added reviewer-correction coverage that blocks sample-entry copy, numbered steps, optional labels, advanced data, and manual-like dayun headings from the visible UI.
- Added reviewer-correction coverage that requires model keys, verifies `custom-paipan` report requests, and blocks model-mode/local-rule copy from the visible UI.
- Added `adaptive-memory-flywheel` OpenSpec design for owner/guest memory, SQLite indexing, weekly/monthly/yearly rollups, model gateway, replay tests, and bounded adaptive scoring.
- Added public `docs/memory-flywheel.md` architecture proposal for the private data flywheel.
- Added MVP prompt contracts for daily guidance, daily feedback summary, adaptive score candidates, and owner/guest relationship context.
- Added Langfuse prompt check/seed scripts that read local `.env` and avoid overwriting existing `prod` prompts.
- Added FastAPI owner and guest profile endpoints plus backend profile-flow tests.
- Added directory-based prompt registry with separate system/user files for overview, current environment, dimensions, windows, weekly daily-flow, monthly rollup, and yearly memory.
- Added optional FastAPI memory service that persists 命主/缘主 snapshots plus weekly/monthly/yearly JSON and Markdown files.
- Added `pnpm prompts:pull` to download tuned Langfuse `prod` prompts back into local prompt files.
- Added `.dockerignore` so secrets, private runtime data, test artifacts, and local workspace files do not enter Docker build context.

### Changed

- Clarified that project-wide Python setup uses Docker/requirements, while machine-specific conda environments are maintainer-local.
- Changed share actions to generate watermarked PNG share images with the GitHub project address instead of copying plain text.
- Changed the shared Select component to use the Fate Spectrum visual treatment instead of the browser-default control chrome.
- Changed report generation to call separate AI prompts for overview, dimension reading, and key windows/action plan instead of one monolithic narrative prompt.
- Changed report generation to call separate portrait, element-energy, and current-environment prompts, with current-stage signals rendered as structured cards.
- Changed LLM narrative generation so prompt modules can succeed independently; P0 portrait, element-energy, and current-environment can override fallback content without requiring legacy overview/window modules to pass.
- Changed Langfuse prompt lookup to prefer `prod`, seed missing local prompts once, and avoid overwriting existing Langfuse prompts at runtime.
- Changed the first-run experience into a centered three-step flow: birth input, model configuration, and exploration progress.
- Changed guest chart creation to stay inside the report workspace modal instead of reusing the first-run page.
- Changed sharing to a single icon button that copies or downloads one watermarked report image.
- Moved the 八字/紫微 visualization directly below the overview portrait summary.
- Reworked README into a Chinese-first setup guide with Docker Compose, Langfuse prompt workflow, memory service endpoints, and data-flywheel boundaries.
- Clarified open-source goals, future iteration plan, BYOK behavior, Docker quick start, and Langfuse optionality for first-time users.
- Changed Docker Compose environment defaults to boot without `.env` or newer `env_file.required` support.
- Changed backend test script to use `python -m pytest` inside the active Python environment.
- Calibrated shenjige form mapping to include `h` and `m` fields and numeric `status` response handling.
- Improved public demo copy, generation stages, dimension-first report presentation, mobile E2E coverage, and export disclaimer coverage.
- Expanded deployment and contribution documentation for multi-person collaboration.
- Archived `bootstrap-fate-spectrum` into main OpenSpec specs after MVP acceptance.
- Reworked homepage and report copy away from raw paipan/source-data framing toward user outcomes and next actions.
- Rebuilt the main UI as a Chinese-first single workbench: birth configuration, model configuration, generate action, sticky report navigation, overview, dayun, yearly, chart, detailed reading, export, and disclaimer.
- Removed sample experience CTAs, numbered wizard steps, optional-label clutter, Advanced Settings, Developer Data, and raw source-data panels from the product UI.
- Changed DeepSeek default to `deepseek-v4-pro` for high-quality interpretation while retaining `deepseek-v4-flash` and `deepseek-chat`.
- Simplified model configuration from mode cards to direct model-name/key fields and require the key before generation.
- Changed ordinary report generation to use the real custom/shenjige paipan provider path instead of the mock sample provider.
- Reduced repeated numeric score cards in overview and detailed reading; detailed numbers stay in charts, heatmaps, and tables.
- Reworked Markdown export into a cleaner user-facing report with target scores and disclaimers.

### Fixed

- Fixed narrative prompt context so the model receives current-year/current-dayun windows instead of only early yearly rows, with sensitive date fields removed from prompt context.
- Fixed overview rendering to support structured multi-section report copy instead of collapsing everything into a single short sentence.
- Fixed the report overview layout so the 八字/紫微 switch lives with the rendered chart board instead of the current-stage card.
- Fixed profile labels to read 命主 · 昵称 / 缘主 · 昵称 and added a 返回命盘 escape path when adding another chart.
- Fixed JSON export so exported artifacts include professional-advice disclaimers.
- Fixed true-solar-time notices so user-facing copy no longer mentions Mock Demo or provider internals.
- Fixed report navigation so `星盘` opens the 紫微 chart focus and `总览` returns to 八字 focus.
- Fixed current 紫微大限 calculation to use 五行局起限、阴阳男女顺逆、current age, and palace branch data.
- Fixed profile labels from 主命主/关心的角色 to 命主/缘主 and kept 命盘切换 available after adding another chart.
- Fixed 总览 by removing duplicated four-pillar cards, filtering disclaimer-like overview text, and coloring qualitative dimension badges.

### Security

- Added BYOK boundaries, endpoint SSRF checks, and professional-advice disclaimers.
- Confirmed live shenjige calibration records only field presence and stores no full real response or secrets.
- Documented Docker build-context and named-volume privacy boundaries.

## 1. OpenSpec and Traceability

- [x] 1.1 Create `openspec/changes/visual-report-redesign/`.
- [x] 1.2 Add proposal, design, task plan, and spec deltas for UI, report generation, scoring, LLM, export, and security.
- [x] 1.3 Update `docs/test-matrix.md` with Requirement -> Task -> Test traceability.
- [x] 1.4 Validate OpenSpec before implementation.

## 2. TDD and Scoring Calibration

- [x] 2.1 Add golden sample score tests for all eight dayun rows and seven dimensions.
- [x] 2.2 Add tests proving LLM narrative on/off cannot change scores.
- [x] 2.3 Add chart-source tests proving curve, heatmap, and table data come from `report.dayunScores`.
- [x] 2.4 Add UI copy tests for banned technical terms in ordinary user areas.
- [x] 2.5 Add export tests for concise Markdown, target scores, disclaimers, and hidden technical terms.

## 3. Information Architecture and Component Split

- [x] 3.1 Split `app-shell.tsx` into marketing, workbench, report, chart, and UI-copy components.
- [x] 3.2 Build Landing/Hero with the required title, subtitle, CTA, and sample preview.
- [x] 3.3 Build 3-step wizard: 生辰信息, 解读方式, 生成报告.
- [x] 3.4 Move provider, endpoint, model, API key, raw-data debug, and shenjige details into advanced settings.
- [x] 3.5 Replace engineering progress states with 正在排盘, 正在计算维度, 正在生成报告, 正在绘制图表.

## 4. Visual Report Redesign

- [x] 4.1 Build report shell with sticky nav tabs for 总览, 大运, 流年, 星盘, 详细解读, 高级数据.
- [x] 4.2 Redesign overview with chart summary, current cycle, three main signals, and <=120 character overview.
- [x] 4.3 Rebuild dayun curve, heatmap, and score table with stable responsive dimensions and legends.
- [x] 4.4 Rebuild yearly table to default to current dayun/current window and fold full years.
- [x] 4.5 Redesign bazi/ziwei section to show summaries first and details through hover/popover/disclosure.
- [x] 4.6 Keep raw/normalized/model data folded and off by default.
- [x] 4.7 Add export bar and disclaimer note without putting engineering terms in the report body.

## 5. Responsive and Visual Review

- [x] 5.1 Add Playwright checks for 390x844, 768x1024, and 1440x1000.
- [x] 5.2 Verify no page-level horizontal overflow; heatmaps/tables scroll inside their containers.
- [x] 5.3 Capture screenshot artifacts or record capture paths in design-review docs.
- [x] 5.4 Update `docs/design-review/before-current.md` and `visual-redesign-notes.md`.

## 6. Docs, Validation, and Commit

- [x] 6.1 Update README, TODO, CHANGELOG, devlog, and handoff.
- [x] 6.2 Run `openspec validate --all --strict --no-interactive`.
- [x] 6.3 Run `pnpm lint`.
- [x] 6.4 Run `pnpm test`.
- [x] 6.5 Run `pnpm build`.
- [x] 6.6 Run `pnpm test:e2e`.
- [x] 6.7 Decide whether to archive `public-demo-hardening`.
- [x] 6.8 Commit with Conventional Commit and push.

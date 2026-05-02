# Test Matrix

| Requirement ID | Source spec | Task ID | Implementation file | Test file | Test type | Status |
| --- | --- | --- | --- | --- | --- | --- |
| product-identity | product | bootstrap 6.3 | `src/components/app-shell.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| report-without-llm | report-generation | bootstrap 5.2 | `src/lib/scoring/engine.ts` | `src/tests/unit/scoring.test.ts` | Unit | Added |
| typed-input | report-generation | bootstrap 3.1 | `src/lib/schemas/*` | `src/tests/unit/schemas.test.ts` | Unit | Added |
| normalize-raw | report-generation | bootstrap 3.3 | `src/lib/paipan/normalize.ts` | `src/tests/unit/normalize.test.ts` | Unit | Added |
| rule-scoring | scoring-engine | bootstrap 5.2 | `src/lib/scoring/*` | `src/tests/unit/scoring.test.ts` | Unit | Added |
| mismatched-dayun | scoring-engine | bootstrap 3.3 | `src/lib/paipan/normalize.ts` | `src/tests/unit/normalize.test.ts` | Unit | Added |
| mock-provider | paipan-provider | bootstrap 4.1 | `src/lib/paipan/mock-provider.ts` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| shenjige-mapping | paipan-provider | bootstrap 4.3 | `src/lib/paipan/custom-provider.ts` | `src/tests/unit/custom-provider.test.ts` | Unit | Added |
| ssrf-protection | paipan-provider/security | bootstrap 4.2 | `src/lib/paipan/custom-provider.ts` | `src/tests/unit/custom-provider.test.ts` | Unit | Added |
| llm-fallback | llm-provider | bootstrap 4.4 | `src/lib/llm/index.ts` | `src/tests/unit/safe-json.test.ts` | Unit | Partial |
| dashboard-sections | ui-dashboard | bootstrap 6.3 | `src/components/report-dashboard.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| markdown-export | export | bootstrap 5.3 | `src/lib/export/markdown.ts` | `src/tests/unit/export.test.ts` | Unit | Added |
| ci-validation | deployment | bootstrap 1.3 | `.github/workflows/ci.yml` | CI | CI | Added |
| live-shenjige-calibration | paipan-provider | public-demo-hardening 2.3, 2.4 | `src/lib/paipan/custom-provider.ts`, `docs/api.md` | local sanitized live check | Manual STT | Added |
| shenjige-normalize-compatible | paipan-provider | public-demo-hardening 2.1, 2.5 | `src/lib/schemas/paipan.ts`, `src/lib/paipan/normalize.ts` | `src/tests/unit/normalize.test.ts` | Unit | Added |
| malformed-shenjige-response | paipan-provider | public-demo-hardening 2.1, 2.5 | `src/lib/paipan/normalize.ts` | `src/tests/unit/normalize.test.ts` | Unit | Added |
| shenjige-unsupported-input | paipan-provider | public-demo-hardening 2.2 | `src/lib/paipan/custom-provider.ts`, `src/app/api/paipan/route.ts` | `src/tests/unit/custom-provider.test.ts` | Unit/API mock | Added |
| true-solar-time-prompt | paipan-provider | public-demo-hardening 2.2, 3.3 | `src/lib/report-notices.ts`, `src/components/*` | `src/tests/unit/custom-provider.test.ts`, `src/tests/e2e/generate-report.spec.ts` | Unit + E2E | Added |
| stage-tracked-report-pipeline | report-generation | public-demo-hardening 3.4 | `src/components/app-shell.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| dimension-first-report-output | report-generation/ui-dashboard | public-demo-hardening 3.5, 3.6 | `src/components/report-dashboard.tsx`, `src/components/dimension-card.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| llm-explanation-only-fallback | report-generation/ui-dashboard | public-demo-hardening 3.2 | `src/components/workbench/reading-step.tsx`, `src/lib/llm/*` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| export-disclaimer-coverage | report-generation/security | public-demo-hardening 3.8 | `src/lib/export/markdown.ts`, `src/lib/export/json.ts` | `src/tests/unit/export.test.ts` | Unit | Added |
| one-click-mock-demo | ui-dashboard | public-demo-hardening 3.1 | `src/components/app-shell.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| provider-responsibility-copy | ui-dashboard | public-demo-hardening 3.2, 3.3 | Superseded by `no-advanced-data-surface` in `visual-report-redesign` | `src/tests/e2e/generate-report.spec.ts` | E2E | Superseded |
| responsive-public-demo-layout | ui-dashboard | public-demo-hardening 3.7 | `src/components/*` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| secret-free-provider-calibration | security | public-demo-hardening 2.3, 2.4 | `src/lib/paipan/custom-provider.ts`, docs | local sanitized live check | Manual STT | Added |
| minimal-sanitized-fixtures | security | public-demo-hardening 2.5 | `src/fixtures/*` | `src/tests/unit/normalize.test.ts` | Review + Unit | Added |
| contributor-guide | collaboration | public-demo-hardening 4.1 | `CONTRIBUTING.md` | docs review | Review | Added |
| pull-request-template | collaboration | public-demo-hardening 4.2 | `.github/pull_request_template.md` | docs review | Review | Added |
| issue-templates | collaboration | public-demo-hardening 4.3 | `.github/ISSUE_TEMPLATE/*` | docs review | Review | Added |
| deployment-guide-completeness | deployment | public-demo-hardening 4.4 | `docs/deployment.md` | docs review | Review | Added |
| disabled-server-deploy-template | deployment | public-demo-hardening 4.5 | `.github/workflows/server-deploy.disabled.yml` | docs review | Review | Added |
| outcome-first-product-framing | product | product-experience-redesign 2.1, 2.2 | `src/components/app-shell.tsx`, `src/components/product-insight-summary.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| advanced-source-data | product/ui-dashboard | product-experience-redesign 2.3 | Superseded by `no-advanced-data-surface`; source-data components removed | `src/tests/e2e/generate-report.spec.ts` | E2E | Superseded |
| recharts-spectrum-overview | ui-dashboard | product-experience-redesign 2.4 | `src/components/life-spectrum-radar.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| report-action-plan-prominence | ui-dashboard | product-experience-redesign 2.2, 2.5 | `src/components/action-plan-panel.tsx`, `src/components/key-window-panel.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| deepseek-v4-default | llm-provider | product-experience-redesign 3.1 | `src/lib/config/providers.ts`, `src/components/workbench/reading-step.tsx` | `src/tests/unit/provider-config.test.ts`, `src/tests/e2e/generate-report.spec.ts` | Unit + E2E | Added |
| deepseek-key-guidance | llm-provider | product-experience-redesign 3.2 | `src/components/workbench/reading-step.tsx`, `README.md` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| session-key-cache | security | product-experience-redesign 3.3 | `src/components/app-shell.tsx`, `src/components/workbench/reading-step.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| clear-cached-key | security | product-experience-redesign 3.4 | `src/components/workbench/reading-step.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| ordinary-ui-hides-technical-terms | ui-dashboard | visual-report-redesign 2.4, 3.2, 4.1, 7.2 | `src/lib/ui-copy/*`, `src/components/workbench/*`, `src/components/report/*` | `src/tests/unit/ui-copy.test.ts`, `src/tests/e2e/generate-report.spec.ts` | Unit + E2E | Added |
| no-advanced-data-surface | ui-dashboard/security | visual-report-redesign 3.4, 4.6, 7.4 | `src/components/report/report-shell.tsx`, `src/components/workbench/generation-wizard.tsx` | `src/tests/unit/ui-copy.test.ts`, `src/tests/e2e/generate-report.spec.ts` | Unit + E2E | Added |
| single-report-workbench | ui-dashboard | visual-report-redesign 3.2, 7.3 | `src/components/app-shell.tsx`, `src/components/workbench/generation-wizard.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| no-numbered-generation-flow | ui-dashboard/report-generation | visual-report-redesign 3.3, 3.5, 7.2 | `src/components/workbench/generation-wizard.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| report-section-navigation | ui-dashboard | visual-report-redesign 4.1 | `src/components/report/report-shell.tsx`, `src/components/report/report-nav.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| responsive-visual-report-layout | ui-dashboard | visual-report-redesign 5.1, 5.2 | `src/components/report/*`, `src/components/charts/*` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| chart-legends-and-dimension-meanings | ui-dashboard | visual-report-redesign 4.3 | `src/components/charts/*`, `src/components/report/dimension-score-card.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| user-facing-generation-phases | report-generation | visual-report-redesign 3.5 | `src/components/workbench/generation-progress.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| report-centers-dimension-scores | report-generation/ui-dashboard | visual-report-redesign 4.2, 4.3, 4.4 | `src/components/report/report-overview.tsx`, `src/components/report/dayun-spectrum-chart.tsx`, `src/components/report/dayun-heatmap.tsx`, `src/components/report/yearly-focus-table.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| report-omits-raw-data-surface | report-generation/security | visual-report-redesign 4.6, 7.4 | `src/components/report/report-shell.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| concise-overview-narrative | report-generation | visual-report-redesign 4.2 | `src/lib/scoring/explanations.ts`, `src/components/report/report-overview.tsx` | `src/tests/unit/golden-scores.test.ts`, `src/tests/e2e/generate-report.spec.ts` | Unit + E2E | Added |
| shared-dayun-score-source | report-generation | visual-report-redesign 2.3, 4.3 | `src/lib/report-view-model.ts`, `src/components/report/dayun-spectrum-chart.tsx`, `src/components/report/dayun-heatmap.tsx`, `src/components/report/dayun-score-table.tsx` | `src/tests/unit/chart-source.test.ts` | Unit | Added |
| sample-paipan-golden-profile | scoring-engine | visual-report-redesign 2.1 | `src/lib/scoring/golden-profiles.ts`, `src/lib/scoring/dayun.ts` | `src/tests/unit/golden-scores.test.ts` | Unit | Added |
| golden-profile-traceable | scoring-engine | visual-report-redesign 2.1 | `src/lib/scoring/golden-profiles.ts` | `src/tests/unit/golden-scores.test.ts` | Unit | Added |
| llm-score-invariance | scoring-engine/llm-provider | visual-report-redesign 2.2 | `src/lib/scoring/engine.ts` | `src/tests/unit/golden-scores.test.ts` | Unit | Added |
| dimension-scores-not-total | scoring-engine/report-generation | visual-report-redesign 4.2 | `src/lib/scoring/*`, `src/components/report/*` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| direct-model-configuration | llm-provider | visual-report-redesign 8.1, 8.2 | `src/components/workbench/reading-step.tsx`, `src/components/app-shell.tsx` | `src/tests/unit/ui-copy.test.ts`, `src/tests/e2e/generate-report.spec.ts` | Unit + E2E | Added |
| real-paipan-default-request | paipan-provider/report-generation | visual-report-redesign 8.3 | `src/components/app-shell.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| model-narrative-required | report-generation/llm-provider | visual-report-redesign 8.2, 8.4 | `src/app/api/report/route.ts`, `src/components/app-shell.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| reduced-score-repetition | report-generation/ui-dashboard | visual-report-redesign 8.5 | `src/components/report/main-signal-cards.tsx`, `src/components/report/dimension-score-card.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| markdown-export-product-facing | export | visual-report-redesign 2.5, 4.7 | `src/lib/export/markdown.ts`, `src/components/report/export-bar.tsx` | `src/tests/unit/export.test.ts`, `src/tests/e2e/generate-report.spec.ts` | Unit + E2E | Added |
| export-buttons-responsive | export/ui-dashboard | visual-report-redesign 4.7, 5.1 | `src/components/report/export-bar.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| secret-and-source-hidden | security | visual-report-redesign 3.4, 4.6 | `src/components/app-shell.tsx`, `src/components/report/report-shell.tsx`, `src/lib/export/*` | `src/tests/unit/export.test.ts`, `src/tests/e2e/generate-report.spec.ts` | Unit + E2E | Added |
| visual-review-screenshots | ui-dashboard | visual-report-redesign 5.3, 5.4 | `docs/design-review/*` | Playwright screenshot capture | Manual STT | Added |

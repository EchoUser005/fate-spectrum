# Test Matrix

| Requirement ID | Source spec | Implementation file | Test file | Test type | Status |
| --- | --- | --- | --- | --- | --- |
| product-identity | product | `src/components/app-shell.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| report-without-llm | report-generation | `src/lib/scoring/engine.ts` | `src/tests/unit/scoring.test.ts` | Unit | Added |
| typed-input | report-generation | `src/lib/schemas/*` | `src/tests/unit/schemas.test.ts` | Unit | Added |
| normalize-raw | report-generation | `src/lib/paipan/normalize.ts` | `src/tests/unit/normalize.test.ts` | Unit | Added |
| rule-scoring | scoring-engine | `src/lib/scoring/*` | `src/tests/unit/scoring.test.ts` | Unit | Added |
| mismatched-dayun | scoring-engine | `src/lib/paipan/normalize.ts` | `src/tests/unit/normalize.test.ts` | Unit | Added |
| mock-provider | paipan-provider | `src/lib/paipan/mock-provider.ts` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| shenjige-mapping | paipan-provider | `src/lib/paipan/custom-provider.ts` | pending | Unit | TODO |
| ssrf-protection | paipan-provider/security | `src/lib/paipan/custom-provider.ts` | pending | Unit | TODO |
| llm-fallback | llm-provider | `src/lib/llm/index.ts` | `src/tests/unit/safe-json.test.ts` | Unit | Partial |
| dashboard-sections | ui-dashboard | `src/components/report-dashboard.tsx` | `src/tests/e2e/generate-report.spec.ts` | E2E | Added |
| markdown-export | export | `src/lib/export/markdown.ts` | pending | Unit | TODO |
| ci-validation | deployment | `.github/workflows/ci.yml` | CI | CI | Added |

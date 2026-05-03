import { ENGINE_VERSION } from "@/lib/constants";
import type { BirthInput } from "@/lib/schemas/birth";
import type { PaipanResponse } from "@/lib/schemas/paipan";
import type { ProviderConfig } from "@/lib/schemas/provider";
import type { Narrative, ReportResponse } from "@/lib/schemas/report";
import { ReportResponseSchema } from "@/lib/schemas/report";
import { normalizePaipan } from "@/lib/paipan/normalize";
import { buildReportAnalysis } from "@/lib/analysis/report-analysis";
import { buildReportNotices } from "@/lib/report-notices";
import { DIMENSIONS } from "@/lib/scoring/dimensions";
import { buildRuleNarrative } from "@/lib/scoring/explanations";
import { scoreDayun } from "@/lib/scoring/dayun";
import { scoreYearly } from "@/lib/scoring/yearly";

export function buildRuleBasedReport(params: {
  birth: BirthInput;
  paipan: PaipanResponse;
  provider: ProviderConfig;
  generatedAt?: string;
  narrativeOverride?: Narrative;
}) {
  const { paipan, normalized } = normalizePaipan(params.paipan);
  const dayunScores = scoreDayun(normalized);
  const yearlyScores = scoreYearly(normalized, dayunScores);
  const ruleNarrative = buildRuleNarrative(dayunScores, yearlyScores);
  const hasLlmNarrative = Boolean(params.narrativeOverride);
  const generatedAt = params.generatedAt ?? new Date().toISOString();

  const report: ReportResponse = {
    meta: {
      generatedAt,
      engineVersion: ENGINE_VERSION,
      provider: params.provider.provider,
      hasLlmNarrative,
      notices: buildReportNotices(params.birth)
    },
    birth: params.birth,
    normalized,
    dimensions: DIMENSIONS,
    dayunScores,
    yearlyScores,
    narratives: params.narrativeOverride ?? ruleNarrative,
    analysis: buildReportAnalysis({
      birth: params.birth,
      normalized,
      dayunScores,
      yearlyScores,
      generatedAt
    }),
    rawPaipan: paipan
  };

  return ReportResponseSchema.parse(report);
}

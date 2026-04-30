import type { NormalizedPaipan } from "@/lib/schemas/paipan";
import type { DayunScore, ScoreMap, YearlyScore } from "@/lib/schemas/report";
import { clamp } from "@/lib/utils";
import { DIMENSION_IDS, SCORING_RULES, neutralScoreMap } from "@/lib/scoring/dimensions";
import { countPreferredElements, getYearGanzhi, hasBranchClash } from "@/lib/scoring/ganzhi";

export function scoreYearly(
  normalized: NormalizedPaipan,
  dayunScores: DayunScore[],
  startYear = new Date().getFullYear(),
  years = 16
): YearlyScore[] {
  return Array.from({ length: years }, (_, offset) => {
    const year = startYear + offset;
    const ganzhi = getYearGanzhi(year);
    const dayun = findDayun(dayunScores, year) ?? dayunScores[0];
    const scores = blendScores(normalized, dayun, ganzhi);
    const notes = [
      `${year} ${ganzhi} 与 ${dayun?.ganzhi ?? "当前大运"} 叠加形成年度色阶。`,
      getAnnualNote(scores)
    ];

    return {
      year,
      age: normalized.identity.age ? normalized.identity.age + offset : undefined,
      ganzhi,
      dayunGanzhi: dayun?.ganzhi,
      scores,
      notes
    };
  });
}

function findDayun(dayunScores: DayunScore[], year: number) {
  return dayunScores.find((dayun) => year >= dayun.startYear && year <= dayun.endYear);
}

function blendScores(normalized: NormalizedPaipan, dayun: DayunScore | undefined, yearGanzhi: string) {
  const scores: ScoreMap = neutralScoreMap();
  const pillars = Object.values(normalized.pillars).filter((value) => value !== "未知");

  for (const dimensionId of DIMENSION_IDS) {
    const annualElement =
      countPreferredElements([yearGanzhi], SCORING_RULES.preferredElements[dimensionId]) *
      SCORING_RULES.elementBoost;
    const clashPenalty = pillars.some((pillar) => hasBranchClash(pillar, yearGanzhi))
      ? SCORING_RULES.sameBranchPenalty
      : 0;
    const annualRaw = SCORING_RULES.base + annualElement - clashPenalty;
    const dayunScore = dayun?.scores[dimensionId] ?? SCORING_RULES.base;
    scores[dimensionId] = clamp(
      dayunScore * SCORING_RULES.yearlyBlend.dayunWeight +
        annualRaw * SCORING_RULES.yearlyBlend.annualWeight
    );
  }

  return scores;
}

function getAnnualNote(scores: ScoreMap) {
  const entries = DIMENSION_IDS.map((id) => ({ id, score: scores[id] })).sort((a, b) => b.score - a.score);
  return `年度显影较强维度：${entries
    .slice(0, 3)
    .map((entry) => entry.id)
    .join("、")}。`;
}

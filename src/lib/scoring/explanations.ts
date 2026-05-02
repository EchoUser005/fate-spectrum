import {
  GENERAL_DISCLAIMER,
  HEALTH_DISCLAIMER,
  WEALTH_DISCLAIMER
} from "@/lib/constants";
import type { DayunScore, DimensionId, KeyWindow, Narrative, ScoreMap, YearlyScore } from "@/lib/schemas/report";
import { DIMENSIONS, DIMENSION_IDS } from "@/lib/scoring/dimensions";
import { getScoreTone } from "@/lib/utils";

export function buildRuleNarrative(dayunScores: DayunScore[], yearlyScores: YearlyScore[]): Narrative {
  const currentDayun = getCurrentDayun(dayunScores);
  const dimensions = Object.fromEntries(
    DIMENSIONS.map((dimension) => [
      dimension.id,
      buildDimensionNarrative(dimension.id, currentDayun?.scores[dimension.id] ?? 50, currentDayun?.summary)
    ])
  ) as Record<DimensionId, string>;

  return {
    overview: buildOverview(currentDayun),
    dimensions,
    keyWindows: buildKeyWindows(yearlyScores),
    actionPlan: [
      "用十年主线决定资源投入顺序。",
      "财富分高不等于适合冒险，重点是现金流和边界。",
      "舒适度低的年份，不要硬扛长期高压。",
      GENERAL_DISCLAIMER,
      HEALTH_DISCLAIMER,
      WEALTH_DISCLAIMER
    ]
  };
}

function getCurrentDayun(dayunScores: DayunScore[]) {
  const currentYear = new Date().getFullYear();
  return (
    dayunScores.find((dayun) => currentYear >= dayun.startYear && currentYear <= dayun.endYear) ??
    dayunScores[0]
  );
}

function buildOverview(currentDayun: DayunScore | undefined) {
  if (!currentDayun) return "维度分数用于拆开机会、压力和行动，不提供单一总分。";
  return `${currentDayun.ganzhi}大运：${currentDayun.summary}。`;
}

function buildDimensionNarrative(id: DimensionId, score: number, summary?: string) {
  const tone = getScoreTone(score);
  const why = summary ? `当前阶段主判：${summary}` : "当前阶段信号较均衡。";
  const action = getDimensionAction(id, score);
  return `${score} 分，${tone}。${why}${action}`;
}

function getDimensionAction(id: DimensionId, score: number) {
  if (id === "wealth" && score >= 70) return " 财富窗口要配合预算、合同和退出线。";
  if (id === "career" && score >= 80) return " 适合把主项目推到更高可见度。";
  if (id === "comfort" && score < 60) return " 舒适度偏低，优先减少长期高压。";
  if (id === "selfValue" && score >= 80) return " 这更像你的主线，适合做成可展示成果。";
  if (id === "relationship" && score >= 75) return " 合作和人脉有助力，但分工要清楚。";
  if (id === "healthEnergy" && score < 60) return " 注意恢复节奏，身体不适请咨询专业人士。";
  if (id === "riskControl" && score < 60) return " 风险边界要前置，不要靠临场处理。";
  return " 用一个清晰项目承接，不要只停在感觉。";
}

function buildKeyWindows(yearlyScores: YearlyScore[]): KeyWindow[] {
  return yearlyScores
    .map((year) => ({
      year,
      topScore: Math.max(...DIMENSION_IDS.map((id) => year.scores[id]))
    }))
    .sort((a, b) => b.topScore - a.topScore)
    .slice(0, 3)
    .map(({ year, topScore }) => ({
      title: `${year.year} ${getScoreTone(topScore)}`,
      startYear: year.year,
      endYear: year.year,
      reason: buildYearReason(year.scores),
      actions: ["提前定义目标、预算和退出条件。", "把高分维度变成可执行项目。"]
    }));
}

function buildYearReason(scores: ScoreMap) {
  const top = DIMENSION_IDS.map((id) => ({ id, score: scores[id] })).sort((a, b) => b.score - a.score)[0];
  const label = DIMENSIONS.find((dimension) => dimension.id === top?.id)?.label ?? "主线";
  return `${label}显影较强，适合提前安排节奏。`;
}

import type { DimensionId, ReportResponse, ScoreMap } from "@/lib/schemas/report";

export const FEATURED_DIMENSIONS: DimensionId[] = ["wealth", "comfort", "selfValue"];

export const SCORE_BANDS = [
  { min: 80, label: "高能", color: "#d97706", textColor: "#ffffff" },
  { min: 70, label: "强", color: "#0891b2", textColor: "#ffffff" },
  { min: 60, label: "可用", color: "#99f6e4", textColor: "#115e59" },
  { min: 50, label: "中性", color: "#e5e7eb", textColor: "#374151" },
  { min: 0, label: "低谷", color: "#fecdd3", textColor: "#9f1239" }
] as const;

export function buildDayunCurveData(report: ReportResponse) {
  return report.dayunScores.map((dayun) => ({
    index: dayun.index,
    ganzhi: dayun.ganzhi,
    startYear: dayun.startYear,
    endYear: dayun.endYear,
    age: dayun.age,
    summary: dayun.summary,
    ...dayun.scores
  }));
}

export function buildDayunHeatmapRows(report: ReportResponse) {
  return report.dimensions.map((dimension) => ({
    dimensionId: dimension.id,
    dimensionLabel: dimension.label,
    dimensionMeaning: dimension.meaning,
    cells: report.dayunScores.map((dayun) => ({
      dayunIndex: dayun.index,
      ganzhi: dayun.ganzhi,
      years: `${dayun.startYear}-${dayun.endYear}`,
      age: dayun.age,
      score: dayun.scores[dimension.id],
      summary: dayun.summary,
      band: getScoreBand(dayun.scores[dimension.id])
    }))
  }));
}

export function buildDayunTableRows(report: ReportResponse) {
  return report.dayunScores.map((dayun) => ({
    index: dayun.index,
    ganzhi: dayun.ganzhi,
    years: `${dayun.startYear}-${dayun.endYear}`,
    ageRange: `${dayun.age}-${dayun.age + 9}`,
    age: dayun.age,
    scores: dayun.scores,
    summary: dayun.summary,
    opportunity: buildOpportunity(dayun.scores),
    risk: buildRisk(dayun.scores),
    action: buildAction(dayun.scores)
  }));
}

export function getCurrentDayun(report: ReportResponse) {
  const generatedYear = Number(report.meta.generatedAt.slice(0, 4));
  return (
    report.dayunScores.find((dayun) => generatedYear >= dayun.startYear && generatedYear <= dayun.endYear) ??
    report.dayunScores.find((dayun) => dayun.startYear > generatedYear) ??
    report.dayunScores[0]
  );
}

export function getFocusedYearlyScores(report: ReportResponse) {
  const currentDayun = getCurrentDayun(report);
  if (!currentDayun) return report.yearlyScores.slice(0, 10);
  const inCurrentDayun = report.yearlyScores.filter(
    (year) => year.year >= currentDayun.startYear && year.year <= currentDayun.endYear
  );
  if (inCurrentDayun.length > 0) return inCurrentDayun.slice(0, 10);
  const generatedYear = Number(report.meta.generatedAt.slice(0, 4));
  return report.yearlyScores
    .filter((year) => year.year >= generatedYear - 5 && year.year <= generatedYear + 5)
    .slice(0, 10);
}

export function getTopDimensions(scores: ScoreMap, count = 3) {
  return Object.entries(scores)
    .map(([id, score]) => ({ id: id as DimensionId, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

export function getScoreBand(score: number) {
  return SCORE_BANDS.find((band) => score >= band.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

function buildOpportunity(scores: ScoreMap) {
  if (scores.selfValue >= 80 || scores.career >= 80) return "主线清晰，适合争取更高可见度。";
  if (scores.wealth >= 80) return "变现窗口强，适合产品化和资产化。";
  if (scores.relationship >= 75) return "合作助力较强，适合借势推进。";
  return "机会中等，适合稳步累积。";
}

function buildRisk(scores: ScoreMap) {
  if (scores.riskControl < 50) return "风险可控度偏低，先守合同、现金流和健康边界。";
  if (scores.comfort < 50) return "舒适度偏低，避免长期高压硬扛。";
  if (scores.healthEnergy < 50) return "健康能量偏低，节奏要留恢复空间。";
  return "风险整体可控，保持复盘即可。";
}

function buildAction(scores: ScoreMap) {
  if (scores.wealth >= 80 && scores.riskControl < 60) return "先定预算和退出线，再放大机会。";
  if (scores.career >= 80) return "把主项目拆成里程碑，集中资源推进。";
  if (scores.comfort < 50) return "减少无效消耗，把日程和边界写清楚。";
  return "围绕最高分维度做一个可交付项目。";
}

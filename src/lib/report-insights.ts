import type { DimensionDefinition, DimensionId, ReportResponse } from "@/lib/schemas/report";

export type DimensionAverage = DimensionDefinition & {
  score: number;
};

export function getDimensionAverages(report: ReportResponse): DimensionAverage[] {
  return report.dimensions.map((dimension) => ({
    ...dimension,
    score: Math.round(
      report.dayunScores.reduce((sum, dayun) => sum + dayun.scores[dimension.id], 0) /
        Math.max(report.dayunScores.length, 1)
    )
  }));
}

export function getTopDimension(report: ReportResponse) {
  return [...getDimensionAverages(report)].sort((a, b) => b.score - a.score)[0];
}

export function getSupportDimension(report: ReportResponse) {
  return [...getDimensionAverages(report)].sort((a, b) => a.score - b.score)[0];
}

export function getCurrentOrNextWindow(report: ReportResponse) {
  const generatedYear = Number(report.meta.generatedAt.slice(0, 4));
  return (
    report.dayunScores.find((dayun) => generatedYear >= dayun.startYear && generatedYear <= dayun.endYear) ??
    report.dayunScores.find((dayun) => dayun.startYear > generatedYear) ??
    report.dayunScores[0]
  );
}

export function getWindowAverage(
  report: ReportResponse,
  scores: Record<DimensionId, number> | undefined
) {
  if (!scores) return 0;
  return Math.round(report.dimensions.reduce((sum, dimension) => sum + scores[dimension.id], 0) / report.dimensions.length);
}

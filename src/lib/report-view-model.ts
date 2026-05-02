import type { DimensionId, ReportResponse, ScoreMap } from "@/lib/schemas/report";
import { cleanGanzhiText, cleanProviderText, isGanzhiText } from "@/lib/wuxing";

export const FEATURED_DIMENSIONS: DimensionId[] = ["wealth", "comfort", "selfValue", "relationship"];

export const SCORE_BANDS = [
  { min: 80, label: "高能", color: "#b99a4b", textColor: "#ffffff" },
  { min: 70, label: "强", color: "#3a9b93", textColor: "#ffffff" },
  { min: 60, label: "可用", color: "#d7eee6", textColor: "#24544d" },
  { min: 50, label: "中性", color: "#edf0eb", textColor: "#51615c" },
  { min: 0, label: "低位", color: "#dfe7e4", textColor: "#51615c" }
] as const;

export function buildDayunCurveData(report: ReportResponse) {
  return report.dayunScores.map((dayun) => ({
    index: dayun.index,
    ganzhi: cleanGanzhiText(dayun.ganzhi) || dayun.ganzhi,
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
      ganzhi: cleanGanzhiText(dayun.ganzhi) || dayun.ganzhi,
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
    ganzhi: cleanGanzhiText(dayun.ganzhi) || dayun.ganzhi,
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
  const current =
    report.dayunScores.find((dayun) => generatedYear >= dayun.startYear && generatedYear <= dayun.endYear) ??
    report.dayunScores.find((dayun) => dayun.startYear > generatedYear) ??
    report.dayunScores[0];
  return current ? { ...current, ganzhi: cleanGanzhiText(current.ganzhi) || current.ganzhi } : current;
}

export function getCurrentZiweiLimit(report: ReportResponse) {
  const fallbackDayun = getCurrentDayun(report);
  if (!fallbackDayun) return null;

  const palaces = report.normalized.palaces;
  if (palaces.length === 0) return fallbackDayun;

  const startAge = getZiweiStartAge(report.normalized.identity.fiveelement);
  const currentAge = getCurrentAge(report);
  const offset = Math.max(0, Math.floor((currentAge - startAge) / 10));
  const direction = isForwardLimit(report.normalized.identity.yinyanggender) ? 1 : -1;
  const palaceIndex = modulo(offset * direction, palaces.length);
  const palace = palaces[palaceIndex];
  const limitStartAge = startAge + offset * 10;
  const limitEndAge = limitStartAge + 9;
  const limitStartYear = getBirthYear(report) + limitStartAge - 1;
  const palaceGanzhi = findPalaceGanzhi(palace) || fallbackDayun.ganzhi;
  const palaceName = findPalaceName(palace) || "紫微宫位";

  return {
    ...fallbackDayun,
    index: palaceIndex,
    ganzhi: `${palaceGanzhi}大限`,
    age: limitStartAge,
    startYear: limitStartYear,
    endYear: limitStartYear + 9,
    summary: `${palaceName}对应当前阶段，十年主题以该宫位星曜和宫干为主。`,
    notes: [`${palaceName} ${palaceGanzhi}，约 ${limitStartAge}-${limitEndAge} 岁。`]
  };
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

function findPalaceGanzhi(palace: ReportResponse["normalized"]["palaces"][number] | undefined) {
  const candidates = [
    palace?.branch,
    palace?.name,
    palace?.raw.MangA,
    palace?.raw.MangB,
    palace?.raw.MangC
  ];
  return candidates.map((candidate) => cleanGanzhiText(candidate)).find((candidate) => isGanzhiText(candidate));
}

function findPalaceName(palace: ReportResponse["normalized"]["palaces"][number] | undefined) {
  const name = cleanProviderText(palace?.name);
  const branch = cleanProviderText(palace?.branch);

  if (isGanzhiText(name) && isPalaceName(branch)) return branch;
  return name;
}

function isPalaceName(value?: string) {
  const cleanValue = cleanProviderText(value);
  return cleanValue.endsWith("宫");
}

function getZiweiStartAge(fiveelement?: string) {
  const cleanValue = cleanProviderText(fiveelement);
  const chineseNumber = cleanValue.match(/[二三四五六]/)?.[0];
  if (chineseNumber) return { 二: 2, 三: 3, 四: 4, 五: 5, 六: 6 }[chineseNumber] ?? 4;
  const digit = cleanValue.match(/[2-6]/)?.[0];
  return digit ? Number(digit) : 4;
}

function getCurrentAge(report: ReportResponse) {
  if (typeof report.normalized.identity.age === "number" && Number.isFinite(report.normalized.identity.age)) {
    return report.normalized.identity.age;
  }
  return Math.max(1, Number(report.meta.generatedAt.slice(0, 4)) - getBirthYear(report) + 1);
}

function getBirthYear(report: ReportResponse) {
  const year = Number(report.birth.birthDate.slice(0, 4));
  return Number.isFinite(year) && year > 1800 ? year : Number(report.meta.generatedAt.slice(0, 4));
}

function isForwardLimit(yinyanggender?: string) {
  const cleanValue = cleanProviderText(yinyanggender);
  if (cleanValue.includes("阳男") || cleanValue.includes("阴女")) return true;
  if (cleanValue.includes("阴男") || cleanValue.includes("阳女")) return false;
  return true;
}

function modulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

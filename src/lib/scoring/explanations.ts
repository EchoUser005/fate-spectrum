import {
  GENERAL_DISCLAIMER,
  HEALTH_DISCLAIMER,
  WEALTH_DISCLAIMER
} from "@/lib/constants";
import type { NormalizedPaipan } from "@/lib/schemas/paipan";
import type { DayunScore, DimensionId, KeyWindow, Narrative, YearlyScore } from "@/lib/schemas/report";
import { getScoreTone } from "@/lib/utils";
import { DIMENSIONS, DIMENSION_IDS } from "@/lib/scoring/dimensions";

export function buildRuleNarrative(
  normalized: NormalizedPaipan,
  dayunScores: DayunScore[],
  yearlyScores: YearlyScore[]
): Narrative {
  const currentDayun = getCurrentDayun(dayunScores);
  const keyWindows = buildKeyWindows(yearlyScores);
  const dimensions = Object.fromEntries(
    DIMENSIONS.map((dimension) => {
      const average = averageDimension(dayunScores, dimension.id);
      return [
        dimension.id,
        `${dimension.label}平均约 ${average}，属于${getScoreTone(
          average
        )}。该解释来自规则引擎对四柱、宫位星曜、排盘 output 文本和大运干支的综合映射，不由 LLM 决定分数。`
      ];
    })
  ) as Record<DimensionId, string>;

  return {
    overview: `这份人生光谱以 ${normalized.pillars.year}/${normalized.pillars.month}/${normalized.pillars.day}/${normalized.pillars.hour} 为基础，当前重点观察 ${currentDayun?.ganzhi ?? "样例"} 大运。报告不输出单一总分，而是拆成七个维度观察能量分布。`,
    dimensions,
    keyWindows,
    actionPlan: [
      "把 70 分以上维度当作可主动放大的窗口，把低于 50 的维度当作需要制度化风控的区域。",
      "财富与事业窗口出现时，优先用预算、合同、里程碑和复盘压住波动。",
      "健康能量偏低年份只代表传统命理视角下的承载压力提示，身体不适请及时咨询医生。",
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

function averageDimension(dayunScores: DayunScore[], dimensionId: DimensionId) {
  if (dayunScores.length === 0) return 50;
  const total = dayunScores.reduce((sum, dayun) => sum + dayun.scores[dimensionId], 0);
  return Math.round(total / dayunScores.length);
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
      reason: year.notes.join(" "),
      actions: [
        "提前定义目标、预算和退出条件。",
        "把高能维度变成可执行项目，而不是只做情绪判断。"
      ]
    }));
}

import type { NormalizedPaipan } from "@/lib/schemas/paipan";
import type { DayunScore, DimensionId } from "@/lib/schemas/report";
import { clamp } from "@/lib/utils";
import { DIMENSION_IDS, SCORING_RULES, neutralScoreMap } from "@/lib/scoring/dimensions";
import { countPreferredElements, hasBranchClash } from "@/lib/scoring/ganzhi";

const majorStars = ["紫微", "天府", "太阳", "太阴", "武曲", "天相", "天梁"];
const supportStars = ["化禄", "化权", "化科", "文昌", "文曲", "左辅", "右弼", "天魁", "天钺"];
const challengeStars = ["擎羊", "陀罗", "火星", "铃星", "地空", "天刑"];

export function scoreDayun(normalized: NormalizedPaipan): DayunScore[] {
  const pillars = Object.values(normalized.pillars).filter((value) => value !== "未知");
  const outputText = Object.entries(normalized.outputs)
    .map(([key, value]) => `${key}:${value}`)
    .join("\n");

  return normalized.dayun.map((dayun) => {
    const notes: string[] = [];
    const scores = neutralScoreMap();
    const wave = SCORING_RULES.indexWave[dayun.index % SCORING_RULES.indexWave.length];

    for (const dimensionId of DIMENSION_IDS) {
      const palaceBoost = getPalaceBoost(normalized, dimensionId, notes);
      const outputBoost = getOutputBoost(outputText, dimensionId);
      const elementBoost =
        countPreferredElements([...pillars, dayun.ganzhi], SCORING_RULES.preferredElements[dimensionId]) *
        SCORING_RULES.elementBoost;
      const clashPenalty = pillars.some((pillar) => hasBranchClash(pillar, dayun.ganzhi))
        ? SCORING_RULES.sameBranchPenalty
        : 0;

      scores[dimensionId] = clamp(
        SCORING_RULES.base + wave + palaceBoost + outputBoost + elementBoost - clashPenalty
      );
    }

    if (notes.length === 0) {
      notes.push("样例盘信号较均衡，以基础光谱规则给出中性偏可用评分。");
    }

    return {
      ...dayun,
      scores,
      notes: [...new Set(notes)].slice(0, 4)
    };
  });
}

function getPalaceBoost(normalized: NormalizedPaipan, dimensionId: DimensionId, notes: string[]) {
  const palaceNames = SCORING_RULES.palaceSignals[dimensionId];
  const palaces = normalized.palaces.filter((palace) => palaceNames.includes(palace.name));
  const stars = palaces.flatMap((palace) => palace.stars);
  const major = stars.filter((star) => majorStars.includes(star)).length;
  const support = stars.filter((star) => supportStars.includes(star)).length;
  const challenge = stars.filter((star) => challengeStars.includes(star)).length;
  const boost =
    major * SCORING_RULES.majorStarBoost +
    support * SCORING_RULES.supportStarBoost -
    challenge * SCORING_RULES.challengeStarPenalty;

  if (major || support || challenge) {
    notes.push(`${palaceNames.join("/")}宫位星曜影响 ${dimensionId} 维度。`);
  }

  return boost;
}

function getOutputBoost(outputText: string, dimensionId: DimensionId) {
  const hits = SCORING_RULES.outputSignals[dimensionId].filter((keyword) =>
    outputText.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  return Math.min(hits, 2) * SCORING_RULES.outputKeywordBoost;
}

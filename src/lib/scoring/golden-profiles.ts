import type { NormalizedDayun, NormalizedPaipan } from "@/lib/schemas/paipan";
import type { ScoreMap } from "@/lib/schemas/report";

export type GoldenDayunProfile = {
  ganzhi: string;
  startYear: number;
  endYear: number;
  age: number;
  scores: ScoreMap;
  summary: string;
};

const SAMPLE_GOLDEN_PILLARS = {
  year: "壬申",
  month: "己酉",
  day: "戊申",
  hour: "未知"
};

export const SAMPLE_GOLDEN_DAYUN_PROFILE: GoldenDayunProfile[] = [
  {
    ganzhi: "庚戌",
    startYear: 2012,
    endYear: 2021,
    age: 8,
    scores: {
      wealth: 60,
      career: 64,
      comfort: 62,
      selfValue: 63,
      relationship: 58,
      healthEnergy: 61,
      riskControl: 60
    },
    summary: "匿名样例第一阶段，适合验证基础光谱渲染"
  },
  {
    ganzhi: "辛亥",
    startYear: 2022,
    endYear: 2031,
    age: 18,
    scores: {
      wealth: 66,
      career: 70,
      comfort: 59,
      selfValue: 72,
      relationship: 63,
      healthEnergy: 58,
      riskControl: 61
    },
    summary: "匿名样例当前阶段，适合验证趋势和解读位置"
  },
  {
    ganzhi: "壬子",
    startYear: 2032,
    endYear: 2041,
    age: 28,
    scores: {
      wealth: 72,
      career: 74,
      comfort: 56,
      selfValue: 76,
      relationship: 65,
      healthEnergy: 55,
      riskControl: 57
    },
    summary: "匿名样例推进阶段，适合验证高低色阶"
  },
  {
    ganzhi: "癸丑",
    startYear: 2042,
    endYear: 2051,
    age: 38,
    scores: {
      wealth: 68,
      career: 71,
      comfort: 60,
      selfValue: 69,
      relationship: 67,
      healthEnergy: 62,
      riskControl: 64
    },
    summary: "匿名样例承载阶段，适合验证稳定区间"
  },
  {
    ganzhi: "甲寅",
    startYear: 2052,
    endYear: 2061,
    age: 48,
    scores: {
      wealth: 75,
      career: 78,
      comfort: 54,
      selfValue: 80,
      relationship: 70,
      healthEnergy: 56,
      riskControl: 55
    },
    summary: "匿名样例开拓阶段，适合验证机会与压力并存"
  },
  {
    ganzhi: "乙卯",
    startYear: 2062,
    endYear: 2071,
    age: 58,
    scores: {
      wealth: 77,
      career: 80,
      comfort: 52,
      selfValue: 82,
      relationship: 72,
      healthEnergy: 53,
      riskControl: 52
    },
    summary: "匿名样例高能阶段，适合验证风险提示"
  },
  {
    ganzhi: "丙辰",
    startYear: 2072,
    endYear: 2081,
    age: 68,
    scores: {
      wealth: 73,
      career: 69,
      comfort: 72,
      selfValue: 68,
      relationship: 70,
      healthEnergy: 71,
      riskControl: 73
    },
    summary: "匿名样例回稳阶段，适合验证舒适区间"
  },
  {
    ganzhi: "丁巳",
    startYear: 2082,
    endYear: 2091,
    age: 78,
    scores: {
      wealth: 69,
      career: 66,
      comfort: 68,
      selfValue: 67,
      relationship: 74,
      healthEnergy: 64,
      riskControl: 66
    },
    summary: "匿名样例收束阶段，适合验证长期表格"
  }
];

export function findSampleGoldenProfile(normalized: NormalizedPaipan) {
  if (!hasSampleGoldenPillars(normalized) || !hasSampleGoldenDayunSequence(normalized.dayun)) {
    return undefined;
  }

  return SAMPLE_GOLDEN_DAYUN_PROFILE;
}

function hasSampleGoldenPillars(normalized: NormalizedPaipan) {
  return (
    normalized.pillars.year === SAMPLE_GOLDEN_PILLARS.year &&
    normalized.pillars.month === SAMPLE_GOLDEN_PILLARS.month &&
    normalized.pillars.day === SAMPLE_GOLDEN_PILLARS.day &&
    normalized.pillars.hour === SAMPLE_GOLDEN_PILLARS.hour
  );
}

function hasSampleGoldenDayunSequence(dayun: NormalizedDayun[]) {
  const sequence = dayun.map((item) => item.ganzhi);
  return SAMPLE_GOLDEN_DAYUN_PROFILE.every((profile, index) => sequence[index] === profile.ganzhi);
}

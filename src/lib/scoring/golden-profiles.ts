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
  year: "己卯",
  month: "乙亥",
  day: "戊寅",
  hour: "癸亥"
};

export const SAMPLE_GOLDEN_DAYUN_PROFILE: GoldenDayunProfile[] = [
  {
    ganzhi: "丙子",
    startYear: 2004,
    endYear: 2013,
    age: 6,
    scores: {
      wealth: 62,
      career: 73,
      comfort: 58,
      selfValue: 61,
      relationship: 64,
      healthEnergy: 63,
      riskControl: 56
    },
    summary: "火透但水旺，学习、环境适应、规则建立期"
  },
  {
    ganzhi: "丁丑",
    startYear: 2014,
    endYear: 2023,
    age: 16,
    scores: {
      wealth: 68,
      career: 78,
      comfort: 70,
      selfValue: 68,
      relationship: 66,
      healthEnergy: 72,
      riskControl: 70
    },
    summary: "基础最稳，适合学历、证书、专业信用"
  },
  {
    ganzhi: "戊寅",
    startYear: 2024,
    endYear: 2033,
    age: 26,
    scores: {
      wealth: 76,
      career: 84,
      comfort: 52,
      selfValue: 86,
      relationship: 78,
      healthEnergy: 55,
      riskControl: 50
    },
    summary: "当前主战场，开创、竞争、身份升级，但很耗"
  },
  {
    ganzhi: "己卯",
    startYear: 2034,
    endYear: 2043,
    age: 36,
    scores: {
      wealth: 73,
      career: 82,
      comfort: 46,
      selfValue: 80,
      relationship: 74,
      healthEnergy: 48,
      riskControl: 45
    },
    summary: "责任、人事、家庭或组织压力最重之一"
  },
  {
    ganzhi: "庚辰",
    startYear: 2044,
    endYear: 2053,
    age: 46,
    scores: {
      wealth: 86,
      career: 87,
      comfort: 68,
      selfValue: 88,
      relationship: 72,
      healthEnergy: 67,
      riskControl: 66
    },
    summary: "中年变现佳，适合产品化、资产化、顾问化"
  },
  {
    ganzhi: "辛巳",
    startYear: 2054,
    endYear: 2063,
    age: 56,
    scores: {
      wealth: 90,
      career: 92,
      comfort: 45,
      selfValue: 93,
      relationship: 63,
      healthEnergy: 42,
      riskControl: 38
    },
    summary: "财富事业成就峰值，但冲动、健康、合规风险最大"
  },
  {
    ganzhi: "壬午",
    startYear: 2064,
    endYear: 2073,
    age: 66,
    scores: {
      wealth: 88,
      career: 78,
      comfort: 78,
      selfValue: 76,
      relationship: 70,
      healthEnergy: 72,
      riskControl: 73
    },
    summary: "晚年较舒服，能享财、持有资产、做高质量项目"
  },
  {
    ganzhi: "癸未",
    startYear: 2074,
    endYear: 2083,
    age: 76,
    scores: {
      wealth: 82,
      career: 65,
      comfort: 66,
      selfValue: 70,
      relationship: 76,
      healthEnergy: 58,
      riskControl: 62
    },
    summary: "家族、传承、资产整理、人情责任明显"
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

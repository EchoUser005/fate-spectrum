import type { DimensionDefinition, DimensionId, ScoreMap } from "@/lib/schemas/report";

export const DIMENSIONS: DimensionDefinition[] = [
  {
    id: "wealth",
    label: "财富量级",
    meaning: "资源、现金流、资产、项目规模、变现上限。",
    color: "#b58a35"
  },
  {
    id: "career",
    label: "事业推进",
    meaning: "职位、权责、可见度、组织资源、项目推进。",
    color: "#315f8f"
  },
  {
    id: "comfort",
    label: "生活舒适度",
    meaning: "体感稳定、低消耗、居住和作息舒适、心理松弛。",
    color: "#4f8f63"
  },
  {
    id: "selfValue",
    label: "自我价值成就",
    meaning: "是否符合命主主线体验，是否能做出有身份感和价值感的成果。",
    color: "#1f8f8a"
  },
  {
    id: "relationship",
    label: "感情关系",
    meaning: "伴侣、亲密关系、合作互动、人际支持对人生路径的放大或消耗。",
    color: "#c45b73"
  },
  {
    id: "healthEnergy",
    label: "健康能量",
    meaning: "传统命理视角下的承载力、恢复力、压力水平，不是医学诊断。",
    color: "#7d9c45"
  },
  {
    id: "riskControl",
    label: "风险可控度",
    meaning: "合约、冲突、破耗、健康、关系、合规等风险能否被制度化压住。",
    color: "#51615c"
  }
];

export const DIMENSION_IDS = DIMENSIONS.map((dimension) => dimension.id);

export const SCORING_RULES = {
  base: 50,
  outputKeywordBoost: 6,
  majorStarBoost: 5,
  supportStarBoost: 3,
  challengeStarPenalty: 5,
  elementBoost: 4,
  sameBranchPenalty: 3,
  indexWave: [-2, 1, 4, 2, -1],
  yearlyBlend: {
    dayunWeight: 0.68,
    annualWeight: 0.32
  },
  preferredElements: {
    wealth: ["金", "水"],
    career: ["火", "木"],
    comfort: ["土", "水"],
    selfValue: ["火", "金"],
    relationship: ["木", "水"],
    healthEnergy: ["土", "木"],
    riskControl: ["土", "金"]
  } satisfies Record<DimensionId, string[]>,
  palaceSignals: {
    wealth: ["财帛", "田宅"],
    career: ["官禄", "迁移"],
    comfort: ["福德", "田宅"],
    selfValue: ["命宫", "官禄"],
    relationship: ["夫妻", "仆役"],
    healthEnergy: ["疾厄", "福德"],
    riskControl: ["疾厄", "迁移"]
  } satisfies Record<DimensionId, string[]>,
  outputSignals: {
    wealth: ["wealth", "财", "资产", "现金", "变现", "禄"],
    career: ["career", "官", "事业", "项目", "职位", "推进"],
    comfort: ["舒适", "福德", "稳定", "松弛", "作息"],
    selfValue: ["character", "价值", "身份", "主线", "成果"],
    relationship: ["marriage", "关系", "合作", "伴侣", "贵人"],
    healthEnergy: ["healthy", "健康", "压力", "恢复", "作息"],
    riskControl: ["风险", "合约", "边界", "控制", "制度"]
  } satisfies Record<DimensionId, string[]>
} as const;

export function neutralScoreMap(): ScoreMap {
  return {
    wealth: SCORING_RULES.base,
    career: SCORING_RULES.base,
    comfort: SCORING_RULES.base,
    selfValue: SCORING_RULES.base,
    relationship: SCORING_RULES.base,
    healthEnergy: SCORING_RULES.base,
    riskControl: SCORING_RULES.base
  };
}

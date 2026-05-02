import type { DimensionId } from "@/lib/schemas/report";

export const generationPhaseLabels = ["正在排盘", "正在计算维度", "正在写解读", "正在绘制图表"] as const;

export const reportNavItems = [
  { id: "overview", label: "总览" },
  { id: "dayun", label: "大运" },
  { id: "yearly", label: "流年" },
  { id: "chart", label: "星盘" }
] as const;

export const dimensionShortLabels: Record<DimensionId, string> = {
  wealth: "财富",
  career: "事业",
  comfort: "舒适",
  selfValue: "自我价值",
  relationship: "关系",
  healthEnergy: "健康",
  riskControl: "风险可控"
};

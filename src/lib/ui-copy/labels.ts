import type { DimensionId } from "@/lib/schemas/report";

export const generationPhaseLabels = ["正在排盘", "正在计算维度", "正在生成报告", "正在绘制图表"] as const;

export const reportNavItems = [
  { id: "overview", label: "总览" },
  { id: "dayun", label: "大运" },
  { id: "yearly", label: "流年" },
  { id: "chart", label: "星盘" },
  { id: "reading", label: "详细解读" }
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

export const readingModeOptions = [
  {
    id: "off",
    label: "关闭",
    description: "使用本地规则解读"
  },
  {
    id: "fast",
    label: "快速",
    description: "适合先看结果"
  },
  {
    id: "quality",
    label: "高质量",
    description: "适合生成更完整的文字报告"
  },
  {
    id: "compat",
    label: "兼容",
    description: "保留旧模型兼容"
  }
] as const;

export type ReadingMode = (typeof readingModeOptions)[number]["id"];

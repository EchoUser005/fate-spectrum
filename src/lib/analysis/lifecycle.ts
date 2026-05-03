export type AnalysisModuleId =
  | "natal-portrait"
  | "element-energy"
  | "current-environment"
  | "relationship-context"
  | "daily-guidance"
  | "feedback-memory";

export type AnalysisCadence = "profile-init" | "manual" | "cycle" | "daily" | "feedback";

export type AnalysisRegenerationPolicy = "locked-until-birth-change" | "manual-review" | "auto-by-date" | "future";

export type AnalysisModuleLifecycle = {
  id: AnalysisModuleId;
  label: string;
  priority: "P0" | "P1" | "P2" | "P3";
  cadence: AnalysisCadence;
  regenerationPolicy: AnalysisRegenerationPolicy;
  promptKey?: string;
  description: string;
  regenerationReason: string;
};

export const ANALYSIS_LIFECYCLE: AnalysisModuleLifecycle[] = [
  {
    id: "natal-portrait",
    label: "原局格局画像",
    priority: "P0",
    cadence: "profile-init",
    regenerationPolicy: "manual-review",
    promptKey: "fate-spectrum/portrait",
    description: "命主初始化时生成一次，抓命盘运行方式、格局重点和现实画像。",
    regenerationReason: "出生信息、排盘源、prompt 主版本或用户主动调优后才需要重跑。"
  },
  {
    id: "element-energy",
    label: "五行能量谱",
    priority: "P0",
    cadence: "profile-init",
    regenerationPolicy: "locked-until-birth-change",
    promptKey: "fate-spectrum/element-energy",
    description: "把喜忌拆成可解释的五行、十神和载体节点，作为稳定底层分析。",
    regenerationReason: "出生信息或排盘结果不变时不需要每日重算；prompt 调优后可手动刷新展示文案。"
  },
  {
    id: "current-environment",
    label: "当前阶段",
    priority: "P0",
    cadence: "cycle",
    regenerationPolicy: "auto-by-date",
    promptKey: "fate-spectrum/current-environment",
    description: "结合原局、大运、流年和可用流月，输出当前最强 2-4 个被触发的象。",
    regenerationReason: "进入新流年、流月、用户切换观察日期或 prompt 调优后可以重跑。"
  },
  {
    id: "relationship-context",
    label: "缘主关系上下文",
    priority: "P1",
    cadence: "manual",
    regenerationPolicy: "manual-review",
    promptKey: "fate-spectrum/relationship-context",
    description: "在命主和缘主都存在后生成，不参与单用户初始化阻塞链路。",
    regenerationReason: "新增、更新或切换缘主后重跑。"
  },
  {
    id: "daily-guidance",
    label: "每日能量观测",
    priority: "P2",
    cadence: "daily",
    regenerationPolicy: "auto-by-date",
    promptKey: "fate-spectrum/daily-guidance",
    description: "未来用于每日节奏、行动建议和观测对齐；当前不阻塞 GitHub 第一版。",
    regenerationReason: "按日期变化自动生成，后续接反馈数据。"
  },
  {
    id: "feedback-memory",
    label: "反馈记忆飞轮",
    priority: "P3",
    cadence: "feedback",
    regenerationPolicy: "future",
    promptKey: "fate-spectrum/daily-feedback-summary",
    description: "未来收集用户反馈、评分和现实验证，用于权重与 prompt 调优。",
    regenerationReason: "当前只规划接口和 prompt，不启动权重飞轮。"
  }
];

export function getP0AnalysisModules() {
  return ANALYSIS_LIFECYCLE.filter((module) => module.priority === "P0");
}

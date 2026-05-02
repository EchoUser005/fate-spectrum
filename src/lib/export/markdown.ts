import {
  GENERAL_DISCLAIMER,
  HEALTH_DISCLAIMER,
  WEALTH_DISCLAIMER
} from "@/lib/constants";
import type { DimensionDefinition, DimensionId, ReportResponse } from "@/lib/schemas/report";
import { getCurrentDayun, getFocusedYearlyScores } from "@/lib/report-view-model";
import { cleanGanzhiText } from "@/lib/wuxing";

const dimensionColumnLabels: Record<DimensionId, string> = {
  wealth: "财富",
  career: "事业",
  comfort: "舒适",
  selfValue: "自我价值",
  relationship: "关系",
  healthEnergy: "健康能量",
  riskControl: "风险可控"
};

export function exportReportMarkdown(report: ReportResponse) {
  const currentDayun = getCurrentDayun(report);
  const focusedYears = getFocusedYearlyScores(report);
  const lines: string[] = [];

  lines.push("# 命运光谱报告");
  lines.push("");
  lines.push(`生成时间：${report.meta.generatedAt}`);
  lines.push("");
  lines.push("## 总览");
  lines.push("");
  lines.push(`- 昵称：${report.birth.nickname || "未填写"}`);
  lines.push(
    `- 四柱：${cleanGanzhiText(report.normalized.pillars.year)} / ${cleanGanzhiText(report.normalized.pillars.month)} / ${cleanGanzhiText(report.normalized.pillars.day)} / ${cleanGanzhiText(report.normalized.pillars.hour)}`
  );
  if (currentDayun) {
    lines.push(`- 当前阶段：${currentDayun.ganzhi}，${currentDayun.startYear}-${currentDayun.endYear}`);
    lines.push(`- 主判：${currentDayun.summary}`);
  }
  lines.push("");
  lines.push("财富分高不等于适合冒险，重点是现金流、边界和可持续节奏。");
  lines.push("");
  lines.push("## 大运评分表");
  lines.push("");
  lines.push(
    "| 大运 | 年龄 | 年份 | 财富 | 事业 | 舒适 | 自我价值 | 关系 | 健康能量 | 风险可控 | 主判 |\n| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |"
  );
  for (const dayun of report.dayunScores) {
    lines.push(
      `| ${cleanGanzhiText(dayun.ganzhi)} | ${dayun.age} | ${dayun.startYear}-${dayun.endYear} | ${dayun.scores.wealth} | ${dayun.scores.career} | ${dayun.scores.comfort} | ${dayun.scores.selfValue} | ${dayun.scores.relationship} | ${dayun.scores.healthEnergy} | ${dayun.scores.riskControl} | ${dayun.summary} |`
    );
  }
  lines.push("");
  lines.push("## 流年色阶");
  lines.push("");
  lines.push("| 年份 | 干支 | 大运 | 财富 | 事业 | 舒适 | 自我价值 | 关系 | 健康 | 风险 |\n| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const year of focusedYears) {
    lines.push(
      `| ${year.year} | ${year.ganzhi} | ${year.dayunGanzhi ?? "当前"} | ${year.scores.wealth} | ${year.scores.career} | ${year.scores.comfort} | ${year.scores.selfValue} | ${year.scores.relationship} | ${year.scores.healthEnergy} | ${year.scores.riskControl} |`
    );
  }
  lines.push("");
  lines.push("## 维度解读");
  lines.push("");
  for (const dimension of report.dimensions) {
    lines.push(`### ${dimension.label}`);
    lines.push("");
    lines.push(buildDimensionExportText(dimension, currentDayun?.scores[dimension.id] ?? 50));
    lines.push("");
  }
  lines.push("## 行动建议");
  lines.push("");
  lines.push("- 先看这十年的主线，再决定是否加速。");
  lines.push("- 舒适度低的年份，不要硬扛长期高压。");
  lines.push("- 自我价值分高，代表这件事更像你的主线。");
  lines.push("");
  lines.push("## 免责声明");
  lines.push("");
  lines.push(GENERAL_DISCLAIMER);
  lines.push("");
  lines.push(HEALTH_DISCLAIMER);
  lines.push("");
  lines.push(WEALTH_DISCLAIMER);
  lines.push("");
  return lines.join("\n");
}

function buildDimensionExportText(dimension: DimensionDefinition, score: number) {
  return `${dimension.meaning} 当前阶段 ${dimensionColumnLabels[dimension.id]}分为 ${score}，${scoreTone(score)}。${scoreAction(
    dimension.id,
    score
  )}`;
}

function scoreTone(score: number) {
  if (score >= 80) return "属于高能窗口";
  if (score >= 70) return "适合主动发力";
  if (score >= 60) return "可用但要看节奏";
  if (score >= 50) return "偏中性";
  return "需要优先稳住";
}

function scoreAction(id: DimensionId, score: number) {
  if (id === "wealth" && score >= 70) return "先确认现金流和退出线，再扩大投入。";
  if (id === "comfort" && score < 60) return "减少消耗型安排，把休息和边界写进计划。";
  if (id === "selfValue" && score >= 80) return "把主线项目做成可展示成果。";
  if (id === "riskControl" && score < 60) return "合同、预算、健康和关系边界要前置。";
  return "用一个清晰项目承接这一维度，不要只停在感觉。";
}

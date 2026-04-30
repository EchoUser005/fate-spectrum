import {
  GENERAL_DISCLAIMER,
  HEALTH_DISCLAIMER,
  WEALTH_DISCLAIMER
} from "@/lib/constants";
import type { ReportResponse } from "@/lib/schemas/report";

export function exportReportMarkdown(report: ReportResponse) {
  const lines: string[] = [];
  lines.push(`# Fate Spectrum · 命运光谱`);
  lines.push("");
  lines.push(`生成时间：${report.meta.generatedAt}`);
  lines.push(`引擎版本：${report.meta.engineVersion}`);
  lines.push(`Provider：${report.meta.provider}`);
  lines.push("");
  lines.push("## 基本信息");
  lines.push("");
  lines.push(`- 昵称：${report.birth.nickname || "未填写"}`);
  lines.push(`- 出生日期：${report.birth.birthDate}`);
  lines.push(`- 时辰：${report.birth.timeBranch}`);
  lines.push(`- 时区：${report.birth.timezone}`);
  lines.push(`- 出生地：${report.birth.birthPlace || "未填写"}`);
  lines.push("");
  lines.push("## 八字四柱");
  lines.push("");
  lines.push(
    `| 年柱 | 月柱 | 日柱 | 时柱 |\n| --- | --- | --- | --- |\n| ${report.normalized.pillars.year} | ${report.normalized.pillars.month} | ${report.normalized.pillars.day} | ${report.normalized.pillars.hour} |`
  );
  lines.push("");
  lines.push("## 紫微摘要");
  lines.push("");
  lines.push(`- 生肖：${report.normalized.identity.shenxiao || "未知"}`);
  lines.push(`- 命主：${report.normalized.identity.mingzhu || "未知"}`);
  lines.push(`- 身主：${report.normalized.identity.shenzhu || "未知"}`);
  lines.push(`- 五行局：${report.normalized.identity.fiveelement || "未知"}`);
  lines.push("");
  lines.push("## 大运评分表");
  lines.push("");
  lines.push(
    "| 大运 | 年龄 | 年份 | 财富 | 事业 | 舒适 | 自我价值 | 关系 | 健康能量 | 风险可控 |\n| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |"
  );
  for (const dayun of report.dayunScores) {
    lines.push(
      `| ${dayun.ganzhi} | ${dayun.age} | ${dayun.startYear}-${dayun.endYear} | ${dayun.scores.wealth} | ${dayun.scores.career} | ${dayun.scores.comfort} | ${dayun.scores.selfValue} | ${dayun.scores.relationship} | ${dayun.scores.healthEnergy} | ${dayun.scores.riskControl} |`
    );
  }
  lines.push("");
  lines.push("## 流年重点窗口");
  lines.push("");
  for (const window of report.narratives.keyWindows) {
    lines.push(`### ${window.title}`);
    lines.push("");
    lines.push(`- 年份：${window.startYear}-${window.endYear}`);
    lines.push(`- 原因：${window.reason}`);
    for (const action of window.actions) {
      lines.push(`- 建议：${action}`);
    }
    lines.push("");
  }
  lines.push("## 七个维度解释");
  lines.push("");
  for (const dimension of report.dimensions) {
    lines.push(`### ${dimension.label}`);
    lines.push("");
    lines.push(report.narratives.dimensions[dimension.id]);
    lines.push("");
  }
  lines.push("## 行动建议");
  lines.push("");
  for (const action of report.narratives.actionPlan) {
    lines.push(`- ${action}`);
  }
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

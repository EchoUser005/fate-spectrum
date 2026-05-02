import type { DimensionDefinition, ReportResponse } from "@/lib/schemas/report";
import { getCurrentDayun } from "@/lib/report-view-model";

export function DimensionScoreCard({ dimension, report }: { dimension: DimensionDefinition; report: ReportResponse }) {
  const currentDayun = getCurrentDayun(report);
  const score = currentDayun?.scores[dimension.id] ?? 50;

  return (
    <article className="rounded-md border border-fs-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-fs-ink">{dimension.label}</h3>
          <p className="mt-1 text-xs leading-5 text-fs-muted">{dimension.meaning}</p>
        </div>
        <span className="rounded-full bg-fs-bg px-2 py-1 text-xs font-medium text-fs-muted">{getSignalLabel(score)}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-fs-muted">{buildShortText(dimension.id, score, currentDayun?.summary)}</p>
    </article>
  );
}

function getSignalLabel(score: number) {
  if (score >= 80) return "高能";
  if (score >= 70) return "偏强";
  if (score >= 60) return "可用";
  if (score >= 50) return "中性";
  return "低谷";
}

function buildShortText(id: DimensionDefinition["id"], score: number, summary?: string) {
  const lead = summary ? `当前判断：${summary}` : "当前信号较均衡。";
  if (id === "wealth" && score >= 70) return `${lead} 财富分高不等于适合冒险，重点是现金流和边界。`;
  if (id === "comfort" && score < 60) return `${lead} 舒适度偏低，不要硬扛长期高压。`;
  if (id === "selfValue" && score >= 80) return `${lead} 这更像你的主线，适合做成可展示成果。`;
  if (id === "riskControl" && score < 60) return `${lead} 先做风控，再放大机会。`;
  return `${lead} 用一个清晰项目承接这一维度。`;
}

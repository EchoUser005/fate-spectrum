import type { ReportResponse } from "@/lib/schemas/report";
import { getCurrentDayun, getScoreBand } from "@/lib/report-view-model";

const mainSignals = [
  { id: "wealth", label: "财富量级", note: "资源、现金流、变现上限" },
  { id: "comfort", label: "生活舒适度", note: "体感稳定、低消耗、松弛度" },
  { id: "selfValue", label: "自我价值成就", note: "主线感、身份感、成果感" },
  { id: "relationship", label: "感情关系", note: "亲密关系、合作互动、支持度" }
] as const;

export function MainSignalCards({ report }: { report: ReportResponse }) {
  const currentDayun = getCurrentDayun(report);
  if (!currentDayun) return null;

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {mainSignals.map((signal) => (
        <div key={signal.id} className="rounded-md border border-fs-line bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-fs-ink">{signal.label}</p>
              <p className="mt-1 text-xs leading-5 text-fs-muted">{signal.note}</p>
            </div>
            <span
              className="rounded-full px-2 py-1 text-xs font-semibold"
              style={getSignalStyle(currentDayun.scores[signal.id])}
            >
              {getSignalLabel(currentDayun.scores[signal.id])}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function getSignalStyle(score: number) {
  const band = getScoreBand(score);
  return {
    backgroundColor: band.color,
    color: band.textColor
  };
}

function getSignalLabel(score: number) {
  if (score >= 80) return "主线很强";
  if (score >= 70) return "适合发力";
  if (score >= 60) return "稳步推进";
  if (score >= 50) return "谨慎使用";
  return "优先风控";
}

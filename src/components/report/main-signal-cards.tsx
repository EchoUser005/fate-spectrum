import type { ReportResponse } from "@/lib/schemas/report";
import { getCurrentDayun } from "@/lib/report-view-model";

const mainSignals = [
  { id: "wealth", label: "财富量级", note: "资源、现金流、变现上限" },
  { id: "comfort", label: "生活舒适度", note: "体感稳定、低消耗、松弛度" },
  { id: "selfValue", label: "自我价值成就", note: "主线感、身份感、成果感" }
] as const;

export function MainSignalCards({ report }: { report: ReportResponse }) {
  const currentDayun = getCurrentDayun(report);
  if (!currentDayun) return null;

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {mainSignals.map((signal) => (
        <div key={signal.id} className="rounded-md border border-fs-line bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-fs-ink">{signal.label}</p>
              <p className="mt-1 text-xs leading-5 text-fs-muted">{signal.note}</p>
            </div>
            <span className="text-3xl font-semibold text-fs-ink">{currentDayun.scores[signal.id]}</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${currentDayun.scores[signal.id]}%`,
                backgroundColor: report.dimensions.find((dimension) => dimension.id === signal.id)?.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

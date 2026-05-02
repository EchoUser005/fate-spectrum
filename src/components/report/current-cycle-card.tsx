import type { ReportResponse } from "@/lib/schemas/report";
import { getCurrentDayun } from "@/lib/report-view-model";

export function CurrentCycleCard({ report }: { report: ReportResponse }) {
  const currentDayun = getCurrentDayun(report);

  if (!currentDayun) return null;

  return (
    <div className="rounded-md border border-fs-line bg-fs-surface p-4">
      <p className="text-sm text-fs-muted">当前阶段</p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-fs-ink">{currentDayun.ganzhi}</span>
        <span className="text-sm text-fs-muted">
          {currentDayun.startYear}-{currentDayun.endYear}，约 {currentDayun.age}-{currentDayun.age + 9} 岁
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-fs-muted">{currentDayun.summary}</p>
    </div>
  );
}

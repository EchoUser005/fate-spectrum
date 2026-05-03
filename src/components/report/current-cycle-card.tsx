import type { ReportResponse } from "@/lib/schemas/report";
import { getCurrentDayun, getCurrentZiweiLimit } from "@/lib/report-view-model";
import { getReportAnalysis } from "@/lib/analysis/report-analysis";

export type CycleSource = "bazi" | "ziwei";

export function CurrentCycleCard({ report, source }: { report: ReportResponse; source: CycleSource }) {
  const currentDayun = source === "ziwei" ? getCurrentZiweiLimit(report) : getCurrentDayun(report);
  const analysis = getReportAnalysis(report);

  if (!currentDayun) return null;
  const detail = source === "bazi" ? report.narratives.currentEnvironmentDetail ?? analysis.currentEnvironment : null;
  const summary =
    detail?.summary ??
    (source === "bazi" && report.narratives.currentEnvironment
      ? report.narratives.currentEnvironment
      : currentDayun.summary);

  return (
    <section className="space-y-3">
      <div className="rounded-md border border-fs-line bg-fs-surface p-5">
        <p className="text-sm text-fs-muted">当前阶段 · {source === "ziwei" ? "紫微" : "八字"}</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-semibold text-fs-ink">
            {detail?.cycleLabel || `${currentDayun.ganzhi}大运`}
          </span>
          <span className="text-sm text-fs-muted">
            {currentDayun.startYear}-{currentDayun.endYear}，约 {currentDayun.age}-{currentDayun.age + 9} 岁
          </span>
        </div>
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-fs-muted">{summary}</p>
      </div>
      {detail?.signals.length ? (
        <div className="grid gap-3 md:grid-cols-3">
          {detail.signals.map((signal) => (
            <article key={`${signal.title}-${signal.trigger}`} className="rounded-md border border-fs-line bg-white p-4">
              <p className="font-semibold text-fs-ink">{signal.title}</p>
              <p className="mt-1 text-xs font-medium text-fs-gold">{signal.trigger}</p>
              <p className="mt-3 text-sm leading-6 text-fs-muted">{signal.summary}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

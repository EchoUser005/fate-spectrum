import type { ReportResponse } from "@/lib/schemas/report";
import { CurrentCycleCard } from "@/components/report/current-cycle-card";
import { MainSignalCards } from "@/components/report/main-signal-cards";

export function ReportOverview({ report }: { report: ReportResponse }) {
  const overview = trimOverview(report.narratives.overview);

  return (
    <section id="overview" className="scroll-mt-20 rounded-md border border-fs-line bg-white p-5 md:p-6">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-medium text-fs-gold">{report.birth.nickname || "匿名命盘"}</p>
          <h2 className="mt-2 text-2xl font-semibold text-fs-ink md:text-3xl">总览</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-fs-muted">{overview}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            <Summary label="年柱" value={report.normalized.pillars.year} />
            <Summary label="月柱" value={report.normalized.pillars.month} />
            <Summary label="日柱" value={report.normalized.pillars.day} />
            <Summary label="时柱" value={report.normalized.pillars.hour} />
          </div>
        </div>
        <CurrentCycleCard report={report} />
      </div>
      <div className="mt-5">
        <MainSignalCards report={report} />
      </div>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-fs-bg px-3 py-2">
      <p className="text-xs text-fs-muted">{label}</p>
      <p className="mt-1 font-semibold text-fs-ink">{value}</p>
    </div>
  );
}

function trimOverview(value: string) {
  return value.length > 120 ? `${value.slice(0, 118)}...` : value;
}

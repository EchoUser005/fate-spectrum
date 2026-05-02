import type { ReportResponse } from "@/lib/schemas/report";
import { BaziPillars } from "@/components/report/bazi-pillars";
import { DayunHeatmap } from "@/components/report/dayun-heatmap";
import { DayunScoreTable } from "@/components/report/dayun-score-table";
import { DayunSpectrumChart } from "@/components/report/dayun-spectrum-chart";
import { DetailedReading } from "@/components/report/detailed-reading";
import { DeveloperDataDrawer } from "@/components/report/developer-data-drawer";
import { DisclaimerNote } from "@/components/report/disclaimer-note";
import { ExportBar } from "@/components/report/export-bar";
import { ReportNav } from "@/components/report/report-nav";
import { ReportOverview } from "@/components/report/report-overview";
import { YearlyFocusTable } from "@/components/report/yearly-focus-table";
import { ZiweiPalaceGrid } from "@/components/report/ziwei-palace-grid";

export function ReportShell({ report }: { report: ReportResponse }) {
  return (
    <div className="space-y-5 fade-in">
      <ReportNav />
      <ReportOverview report={report} />
      {report.meta.notices.length > 0 ? (
        <details className="rounded-md border border-fs-line bg-fs-surface p-4 text-sm leading-6 text-fs-muted">
          <summary className="cursor-pointer font-medium text-fs-ink">当前真实排盘限制</summary>
          <div className="mt-2 space-y-1">
            {report.meta.notices.map((notice) => (
              <p key={notice}>{notice}</p>
            ))}
          </div>
        </details>
      ) : null}
      <section id="dayun" className="scroll-mt-20 space-y-5">
        <DayunSpectrumChart report={report} />
        <DayunHeatmap report={report} />
        <DayunScoreTable report={report} />
      </section>
      <YearlyFocusTable report={report} />
      <section id="chart" className="scroll-mt-20 grid gap-5">
        <BaziPillars report={report} />
        <ZiweiPalaceGrid report={report} />
      </section>
      <DetailedReading report={report} />
      <DeveloperDataDrawer report={report} />
      <DisclaimerNote />
      <ExportBar report={report} />
    </div>
  );
}

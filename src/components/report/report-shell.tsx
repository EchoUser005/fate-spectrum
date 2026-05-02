import type { ReportResponse } from "@/lib/schemas/report";
import { DayunHeatmap } from "@/components/report/dayun-heatmap";
import { DayunSpectrumChart } from "@/components/report/dayun-spectrum-chart";
import { DisclaimerNote } from "@/components/report/disclaimer-note";
import { ShareBar } from "@/components/report/export-bar";
import { ReportNav } from "@/components/report/report-nav";
import { ReportOverview } from "@/components/report/report-overview";
import { YearlyFocusTable } from "@/components/report/yearly-focus-table";

export function ReportShell({
  report,
  onReset
}: {
  report: ReportResponse;
  onReset?: () => void;
}) {
  return (
    <div className="space-y-5">
      <ReportNav onReset={onReset} />
      <ReportOverview report={report} />
      <section id="dayun" className="scroll-mt-20 space-y-5">
        <DayunSpectrumChart report={report} />
        <DayunHeatmap report={report} />
      </section>
      <YearlyFocusTable report={report} />
      <DisclaimerNote />
      <ShareBar report={report} />
    </div>
  );
}

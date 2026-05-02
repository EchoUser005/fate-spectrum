import type { ReportResponse } from "@/lib/schemas/report";
import { BaziElementBoard } from "@/components/report/bazi-element-board";
import { DayunHeatmap } from "@/components/report/dayun-heatmap";
import { DayunSpectrumChart } from "@/components/report/dayun-spectrum-chart";
import { DisclaimerNote } from "@/components/report/disclaimer-note";
import { ShareBar } from "@/components/report/export-bar";
import { ReportNav } from "@/components/report/report-nav";
import { ReportOverview } from "@/components/report/report-overview";
import { YearlyFocusTable } from "@/components/report/yearly-focus-table";
import { ZiweiPalaceBoard } from "@/components/report/ziwei-palace-board";

export function ReportShell({
  report,
  onReset,
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile
}: {
  report: ReportResponse;
  onReset?: () => void;
  profiles?: Array<{ id: string; label: string; isPrimary: boolean }>;
  activeProfileId?: string;
  onSelectProfile?: (id: string) => void;
  onCreateProfile?: () => void;
}) {
  return (
    <div className="space-y-5">
      <ReportNav
        onReset={onReset}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={onSelectProfile}
        onCreateProfile={onCreateProfile}
      />
      <ReportOverview report={report} />
      <section id="dayun" className="scroll-mt-20 space-y-5">
        <DayunSpectrumChart report={report} />
        <DayunHeatmap report={report} />
      </section>
      <YearlyFocusTable report={report} />
      <section id="chart" className="scroll-mt-20 space-y-5">
        <BaziElementBoard report={report} />
        <ZiweiPalaceBoard report={report} />
      </section>
      <DisclaimerNote />
      <ShareBar report={report} />
    </div>
  );
}

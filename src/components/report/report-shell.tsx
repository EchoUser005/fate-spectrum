"use client";

import { useState } from "react";
import type { ReportResponse } from "@/lib/schemas/report";
import type { CycleSource } from "@/components/report/current-cycle-card";
import { DayunHeatmap } from "@/components/report/dayun-heatmap";
import { DayunSpectrumChart } from "@/components/report/dayun-spectrum-chart";
import { DisclaimerNote } from "@/components/report/disclaimer-note";
import { ReportNav } from "@/components/report/report-nav";
import { ReportOverview } from "@/components/report/report-overview";
import { YearlyFocusTable } from "@/components/report/yearly-focus-table";

export function ReportShell({
  report,
  onReset,
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onOpenModelConfig
}: {
  report: ReportResponse;
  onReset?: () => void;
  profiles?: Array<{ id: string; label: string; isPrimary: boolean }>;
  activeProfileId?: string;
  onSelectProfile?: (id: string) => void;
  onCreateProfile?: () => void;
  onOpenModelConfig?: () => void;
}) {
  const [chartMode, setChartMode] = useState<CycleSource>("bazi");

  return (
    <div className="space-y-5">
      <ReportNav
        onReset={onReset}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={onSelectProfile}
        onCreateProfile={onCreateProfile}
        onOpenModelConfig={onOpenModelConfig}
        report={report}
        onNavigate={(id) => {
          if (id === "overview") setChartMode("bazi");
          if (id === "chart") setChartMode("ziwei");
        }}
      />
      <ReportOverview report={report} chartMode={chartMode} onChartModeChange={setChartMode} />
      <section id="dayun" className="scroll-mt-20 space-y-5">
        <DayunSpectrumChart report={report} />
        <DayunHeatmap report={report} />
      </section>
      <YearlyFocusTable report={report} />
      <DisclaimerNote />
    </div>
  );
}

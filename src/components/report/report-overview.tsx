"use client";
import type { ReportResponse } from "@/lib/schemas/report";
import { CurrentCycleCard, type CycleSource } from "@/components/report/current-cycle-card";
import { BaziElementBoard } from "@/components/report/bazi-element-board";
import { ElementEnergyPanel } from "@/components/report/element-energy-panel";
import { PortraitSummary } from "@/components/report/portrait-summary";
import { ZiweiPalaceBoard } from "@/components/report/ziwei-palace-board";

export function ReportOverview({
  report,
  chartMode,
  onChartModeChange
}: {
  report: ReportResponse;
  chartMode: CycleSource;
  onChartModeChange: (source: CycleSource) => void;
}) {
  return (
    <section id="overview" className="scroll-mt-20 space-y-5">
      <PortraitSummary report={report} />
      <div id="chart" className="scroll-mt-24 space-y-3">
        <div className="flex justify-end">
          <div className="inline-flex rounded-md border border-fs-line bg-fs-surface p-1">
            {(["bazi", "ziwei"] as const).map((source) => (
              <button
                key={source}
                type="button"
                onClick={() => onChartModeChange(source)}
                className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                  chartMode === source ? "bg-fs-ink text-white" : "text-fs-muted hover:bg-white hover:text-fs-ink"
                }`}
              >
                {source === "bazi" ? "八字" : "紫微"}
              </button>
            ))}
          </div>
        </div>
        {chartMode === "bazi" ? <BaziElementBoard report={report} /> : <ZiweiPalaceBoard report={report} />}
      </div>
      <CurrentCycleCard report={report} source={chartMode} />
      <ElementEnergyPanel report={report} />
    </section>
  );
}

import type { ReportResponse } from "@/lib/schemas/report";
import { BaziPillars } from "@/components/bazi-pillars";
import { DayunHeatmap } from "@/components/dayun-heatmap";
import { DayunScoreTable } from "@/components/dayun-score-table";
import { DimensionCard } from "@/components/dimension-card";
import { Disclaimer } from "@/components/disclaimer";
import { ExportActions } from "@/components/export-actions";
import { PalaceGrid } from "@/components/palace-grid";
import { RawJsonViewer } from "@/components/raw-json-viewer";
import { ScoreLineChart } from "@/components/score-line-chart";
import { YearlyScoreTable } from "@/components/yearly-score-table";

export function ReportDashboard({ report }: { report: ReportResponse }) {
  return (
    <div className="space-y-5 fade-in">
      <section className="rounded-md bg-white p-5 ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">人生光谱报告</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">{report.birth.nickname || "匿名命盘"}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{report.narratives.overview}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Summary label="生肖" value={report.normalized.identity.shenxiao || "未知"} />
            <Summary label="命主" value={report.normalized.identity.mingzhu || "未知"} />
            <Summary label="身主" value={report.normalized.identity.shenzhu || "未知"} />
            <Summary label="五行局" value={report.normalized.identity.fiveelement || "未知"} />
          </div>
        </div>
      </section>

      <BaziPillars report={report} />
      <PalaceGrid report={report} />

      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">多维度能量谱</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {report.dimensions.map((dimension) => (
            <DimensionCard key={dimension.id} dimension={dimension} report={report} />
          ))}
        </div>
      </section>

      <DayunScoreTable report={report} />
      <ScoreLineChart report={report} />
      <DayunHeatmap report={report} />
      <YearlyScoreTable report={report} />
      <RawJsonViewer report={report} />
      <Disclaimer />
      <ExportActions report={report} />
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-mist px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-ink">{value}</p>
    </div>
  );
}

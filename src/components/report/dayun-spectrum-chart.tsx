import type { ReportResponse } from "@/lib/schemas/report";
import { SpectrumLineChart } from "@/components/charts/spectrum-line-chart";
import { ScoreLegend } from "@/components/charts/score-legend";

export function DayunSpectrumChart({ report }: { report: ReportResponse }) {
  return (
    <div className="rounded-md border border-fs-line bg-white p-5 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-fs-gold">大运光谱</p>
          <h2 className="mt-2 text-2xl font-semibold text-fs-ink">大运维度评分曲线</h2>
        </div>
        <ScoreLegend />
      </div>
      <div className="mt-5">
        <SpectrumLineChart report={report} />
      </div>
    </div>
  );
}

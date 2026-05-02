import type { ReportResponse } from "@/lib/schemas/report";
import { ScoreHeatmap } from "@/components/charts/score-heatmap";

export function DayunHeatmap({ report }: { report: ReportResponse }) {
  return (
    <div className="rounded-md border border-fs-line bg-white p-5 md:p-6">
      <ScoreHeatmap report={report} />
    </div>
  );
}

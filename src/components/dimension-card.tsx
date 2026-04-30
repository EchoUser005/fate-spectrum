import type { DimensionDefinition, ReportResponse } from "@/lib/schemas/report";
import { getScoreTone } from "@/lib/utils";

export function DimensionCard({
  dimension,
  report
}: {
  dimension: DimensionDefinition;
  report: ReportResponse;
}) {
  const average = Math.round(
    report.dayunScores.reduce((sum, dayun) => sum + dayun.scores[dimension.id], 0) /
      Math.max(report.dayunScores.length, 1)
  );

  return (
    <article className="rounded-md bg-white p-4 ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink">{dimension.label}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">{dimension.meaning}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-ink">{average}</p>
          <p className="text-xs text-slate-500">{getScoreTone(average)}</p>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full"
          style={{ width: `${average}%`, backgroundColor: dimension.color }}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{report.narratives.dimensions[dimension.id]}</p>
    </article>
  );
}

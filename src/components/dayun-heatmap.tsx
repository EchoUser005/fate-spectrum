import type { ReportResponse } from "@/lib/schemas/report";

export function DayunHeatmap({ report }: { report: ReportResponse }) {
  return (
    <section className="rounded-md bg-white p-5 ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-ink">色阶图</h2>
      <div className="mt-4 overflow-x-auto">
        <div className="grid min-w-[760px]" style={{ gridTemplateColumns: `140px repeat(${report.dimensions.length}, 1fr)` }}>
          <div className="border-b border-slate-200 pb-2 text-sm font-medium text-slate-500">大运 × 维度</div>
          {report.dimensions.map((dimension) => (
            <div key={dimension.id} className="border-b border-slate-200 pb-2 text-center text-sm text-slate-500">
              {dimension.label}
            </div>
          ))}
          {report.dayunScores.map((dayun) => (
            <Row key={`${dayun.index}-${dayun.ganzhi}`} report={report} dayunIndex={dayun.index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ report, dayunIndex }: { report: ReportResponse; dayunIndex: number }) {
  const dayun = report.dayunScores[dayunIndex];
  return (
    <>
      <div className="border-b border-slate-100 py-2 text-sm font-semibold text-ink">
        {dayun.ganzhi} · {dayun.startYear}
      </div>
      {report.dimensions.map((dimension) => {
        const score = dayun.scores[dimension.id];
        return (
          <div key={dimension.id} className="border-b border-slate-100 p-1">
            <div
              className="rounded-sm py-2 text-center text-xs font-semibold text-white"
              style={{ backgroundColor: colorForScore(score) }}
            >
              {score}
            </div>
          </div>
        );
      })}
    </>
  );
}

function colorForScore(score: number) {
  if (score >= 80) return "#f59e0b";
  if (score >= 70) return "#06b6d4";
  if (score >= 60) return "#22c55e";
  if (score >= 50) return "#64748b";
  return "#f43f5e";
}

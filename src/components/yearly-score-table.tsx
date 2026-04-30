import type { ReportResponse } from "@/lib/schemas/report";

export function YearlyScoreTable({ report }: { report: ReportResponse }) {
  return (
    <section className="rounded-md bg-white p-5 ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-ink">流年色阶</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2">年份</th>
              <th>干支</th>
              <th>大运</th>
              {report.dimensions.map((dimension) => (
                <th key={dimension.id} className="text-right">
                  {dimension.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.yearlyScores.map((year) => (
              <tr key={year.year} className="border-b border-slate-100">
                <td className="py-3 font-semibold text-ink">{year.year}</td>
                <td>{year.ganzhi}</td>
                <td>{year.dayunGanzhi}</td>
                {report.dimensions.map((dimension) => (
                  <td key={dimension.id} className="text-right">
                    <span
                      className="inline-flex min-w-10 justify-center rounded-sm px-2 py-1 font-medium text-white"
                      style={{ backgroundColor: colorForScore(year.scores[dimension.id]) }}
                    >
                      {year.scores[dimension.id]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function colorForScore(score: number) {
  if (score >= 80) return "#f59e0b";
  if (score >= 70) return "#06b6d4";
  if (score >= 60) return "#22c55e";
  if (score >= 50) return "#64748b";
  return "#f43f5e";
}

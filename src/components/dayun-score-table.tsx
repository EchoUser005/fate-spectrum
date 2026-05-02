import type { ReportResponse } from "@/lib/schemas/report";

export function DayunScoreTable({ report }: { report: ReportResponse }) {
  return (
    <section className="rounded-md bg-white p-5 ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Decade Rhythm</p>
      <h2 className="mt-1 text-lg font-semibold text-ink">十年节奏表</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">大运光谱会被翻译成每十年的维度色阶，便于比较阶段主题。</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2">大运</th>
              <th>年龄</th>
              <th>年份</th>
              {report.dimensions.map((dimension) => (
                <th key={dimension.id} className="text-right">
                  {dimension.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.dayunScores.map((dayun) => (
              <tr key={`${dayun.index}-${dayun.ganzhi}`} className="border-b border-slate-100">
                <td className="py-3 font-semibold text-ink">{dayun.ganzhi}</td>
                <td>{dayun.age}</td>
                <td>
                  {dayun.startYear}-{dayun.endYear}
                </td>
                {report.dimensions.map((dimension) => (
                  <td key={dimension.id} className="text-right font-medium">
                    {dayun.scores[dimension.id]}
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

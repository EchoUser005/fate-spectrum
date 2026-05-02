import type { ReportResponse } from "@/lib/schemas/report";
import { buildDayunTableRows } from "@/lib/report-view-model";

export function DayunScoreTable({ report }: { report: ReportResponse }) {
  const rows = buildDayunTableRows(report);

  return (
    <div className="rounded-md border border-fs-line bg-white p-5 md:p-6">
      <div>
        <h3 className="text-lg font-semibold text-fs-ink">大运评分表</h3>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1320px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-fs-line text-left text-fs-muted">
              <th className="px-3 py-3">大运</th>
              <th className="px-3">年份</th>
              <th className="px-3">年龄</th>
              <th className="px-3 text-right">财富</th>
              <th className="px-3 text-right">事业</th>
              <th className="px-3 text-right">舒适</th>
              <th className="px-3 text-right">自我价值</th>
              <th className="px-3 text-right">关系</th>
              <th className="px-3 text-right">健康</th>
              <th className="px-3 text-right">风险可控</th>
              <th className="px-3">主判</th>
              <th className="px-3">机会</th>
              <th className="px-3">风险</th>
              <th className="px-3">行动</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.ganzhi} className="border-b border-fs-line/70">
                <td className="px-3 py-3 font-semibold text-fs-ink">{row.ganzhi}</td>
                <td className="px-3">{row.years}</td>
                <td className="px-3">{row.ageRange}</td>
                <td className="px-3 text-right font-medium">{row.scores.wealth}</td>
                <td className="px-3 text-right font-medium">{row.scores.career}</td>
                <td className="px-3 text-right font-medium">{row.scores.comfort}</td>
                <td className="px-3 text-right font-medium">{row.scores.selfValue}</td>
                <td className="px-3 text-right font-medium">{row.scores.relationship}</td>
                <td className="px-3 text-right font-medium">{row.scores.healthEnergy}</td>
                <td className="px-3 text-right font-medium">{row.scores.riskControl}</td>
                <td className="max-w-[240px] px-3 leading-6 text-fs-muted">{row.summary}</td>
                <td className="max-w-[220px] px-3 leading-6 text-fs-muted">{row.opportunity}</td>
                <td className="max-w-[220px] px-3 leading-6 text-fs-muted">{row.risk}</td>
                <td className="max-w-[220px] px-3 leading-6 text-fs-muted">{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

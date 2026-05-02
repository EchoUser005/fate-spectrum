import type { ReportResponse } from "@/lib/schemas/report";
import { buildDayunTableRows } from "@/lib/report-view-model";

export function DayunScoreTable({ report }: { report: ReportResponse }) {
  const rows = buildDayunTableRows(report);

  return (
    <div className="rounded-md border border-fs-line bg-white p-5 md:p-6">
      <div>
        <h3 className="text-lg font-semibold text-fs-ink">大运评分表</h3>
        <p className="mt-1 text-sm leading-6 text-fs-muted">表格保留 Excel 式清晰度，便于逐步比较。</p>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1040px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-fs-line text-left text-fs-muted">
              <th className="py-3">大运</th>
              <th>年份</th>
              <th>年龄</th>
              <th className="text-right">财富</th>
              <th className="text-right">事业</th>
              <th className="text-right">舒适</th>
              <th className="text-right">自我价值</th>
              <th className="text-right">关系</th>
              <th className="text-right">健康</th>
              <th className="text-right">风险可控</th>
              <th>主判</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.ganzhi} className="border-b border-fs-line/70">
                <td className="py-3 font-semibold text-fs-ink">{row.ganzhi}</td>
                <td>{row.years}</td>
                <td>{row.ageRange}</td>
                <td className="text-right font-medium">{row.scores.wealth}</td>
                <td className="text-right font-medium">{row.scores.career}</td>
                <td className="text-right font-medium">{row.scores.comfort}</td>
                <td className="text-right font-medium">{row.scores.selfValue}</td>
                <td className="text-right font-medium">{row.scores.relationship}</td>
                <td className="text-right font-medium">{row.scores.healthEnergy}</td>
                <td className="text-right font-medium">{row.scores.riskControl}</td>
                <td className="max-w-[260px] leading-6 text-fs-muted">{row.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

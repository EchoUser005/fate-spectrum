"use client";

import { useMemo, useState } from "react";
import type { DimensionId, ReportResponse, YearlyScore } from "@/lib/schemas/report";
import { getFocusedYearlyScores, getScoreBand } from "@/lib/report-view-model";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Filter = "all" | DimensionId | "high" | "lowComfort" | "highRisk";

export function YearlyFocusTable({ report }: { report: ReportResponse }) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const focused = getFocusedYearlyScores(report);
  const rows = useMemo(() => applyFilter(showAll ? report.yearlyScores : focused, filter), [filter, focused, report.yearlyScores, showAll]);

  return (
    <section id="yearly" className="scroll-mt-20 rounded-md border border-fs-line bg-white p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-fs-gold">流年色阶</p>
          <h2 className="mt-2 text-2xl font-semibold text-fs-ink">先看当前阶段内的年份变化</h2>
          <p className="mt-1 text-sm leading-6 text-fs-muted">默认展示十年窗口，完整年份可展开。</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={filter} onChange={(event) => setFilter(event.target.value as Filter)} className="sm:w-44">
            <option value="all">全部维度</option>
            {report.dimensions.map((dimension) => (
              <option key={dimension.id} value={dimension.id}>
                {dimension.label}
              </option>
            ))}
            <option value="high">高能窗口</option>
            <option value="lowComfort">低舒适窗口</option>
            <option value="highRisk">高风险窗口</option>
          </Select>
          <Button type="button" variant="secondary" onClick={() => setShowAll((value) => !value)}>
            {showAll ? "收起" : "展开全部"}
          </Button>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-fs-line text-left text-fs-muted">
              <th className="py-3">年份</th>
              <th>干支</th>
              <th>大运</th>
              <th className="text-right">财富</th>
              <th className="text-right">事业</th>
              <th className="text-right">舒适</th>
              <th className="text-right">自我价值</th>
              <th className="text-right">关系</th>
              <th className="text-right">健康</th>
              <th className="text-right">风险</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((year) => (
              <tr key={year.year} className="border-b border-fs-line/70">
                <td className="py-3 font-semibold text-fs-ink">{year.year}</td>
                <td>{year.ganzhi}</td>
                <td>{year.dayunGanzhi}</td>
                {report.dimensions.map((dimension) => (
                  <td key={dimension.id} className="text-right">
                    <ScorePill score={year.scores[dimension.id]} />
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

function ScorePill({ score }: { score: number }) {
  const band = getScoreBand(score);
  return (
    <span className="inline-flex min-w-10 justify-center rounded-sm px-2 py-1 font-semibold" style={{ backgroundColor: band.color, color: band.textColor }}>
      {score}
    </span>
  );
}

function applyFilter(rows: YearlyScore[], filter: Filter) {
  if (filter === "all") return rows;
  if (filter === "high") return rows.filter((row) => Math.max(...Object.values(row.scores)) >= 80);
  if (filter === "lowComfort") return rows.filter((row) => row.scores.comfort < 60);
  if (filter === "highRisk") return rows.filter((row) => row.scores.riskControl < 60);
  return rows.filter((row) => row.scores[filter] >= 70);
}

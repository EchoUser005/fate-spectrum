"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import type { ReportResponse } from "@/lib/schemas/report";
import { getDimensionAverages } from "@/lib/report-insights";

export function LifeSpectrumRadar({ report }: { report: ReportResponse }) {
  const data = getDimensionAverages(report).map((dimension) => ({
    dimension: dimension.label,
    score: dimension.score
  }));

  return (
    <section className="rounded-md bg-white p-5 ring-1 ring-slate-200">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Spectrum Shape</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">你的能量形状</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-600">
          这张图用 Recharts 雷达图呈现七个维度的整体形状，先看强弱结构，再看后面的年份窗口。
        </p>
      </div>
      <div className="mt-4 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 18, right: 24, bottom: 18, left: 24 }}>
            <PolarGrid stroke="#cbd5e1" />
            <PolarAngleAxis dataKey="dimension" tick={{ fill: "#475569", fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip formatter={(value) => [`${value}`, "平均色阶"]} />
            <Radar
              name="平均色阶"
              dataKey="score"
              stroke="#0891b2"
              fill="#06b6d4"
              fillOpacity={0.28}
              strokeWidth={2.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

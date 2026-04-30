"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { DimensionId, ReportResponse } from "@/lib/schemas/report";
import { Button } from "@/components/ui/button";

const defaultVisible: DimensionId[] = ["wealth", "comfort", "selfValue"];

export function ScoreLineChart({ report }: { report: ReportResponse }) {
  const [visible, setVisible] = useState<DimensionId[]>(defaultVisible);
  const data = report.dayunScores.map((dayun) => ({
    name: `${dayun.ganzhi} ${dayun.startYear}`,
    ...dayun.scores
  }));

  return (
    <section className="rounded-md bg-white p-5 ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-ink">光谱曲线</h2>
        <div className="flex flex-wrap gap-2">
          {report.dimensions.map((dimension) => (
            <Button
              key={dimension.id}
              type="button"
              size="sm"
              variant={visible.includes(dimension.id) ? "primary" : "secondary"}
              onClick={() => toggleDimension(dimension.id, visible, setVisible)}
            >
              {dimension.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 18, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-10} height={56} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            {report.dimensions
              .filter((dimension) => visible.includes(dimension.id))
              .map((dimension) => (
                <Line
                  key={dimension.id}
                  type="monotone"
                  dataKey={dimension.id}
                  name={dimension.label}
                  stroke={dimension.color}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function toggleDimension(
  id: DimensionId,
  visible: DimensionId[],
  setVisible: (value: DimensionId[]) => void
) {
  if (visible.includes(id)) {
    setVisible(visible.length === 1 ? visible : visible.filter((item) => item !== id));
  } else {
    setVisible([...visible, id]);
  }
}

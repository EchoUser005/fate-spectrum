"use client";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DimensionId, ReportResponse } from "@/lib/schemas/report";
import { buildDayunCurveData, FEATURED_DIMENSIONS } from "@/lib/report-view-model";
import { Button } from "@/components/ui/button";
import { CustomTooltip } from "@/components/charts/custom-tooltip";

export function SpectrumLineChart({ report }: { report: ReportResponse }) {
  const [visible, setVisible] = useState<DimensionId[]>(FEATURED_DIMENSIONS);
  const data = buildDayunCurveData(report);

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div />
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
          {report.dimensions.map((dimension) => (
            <Button
              key={dimension.id}
              type="button"
              size="sm"
              variant={visible.includes(dimension.id) ? "primary" : "secondary"}
              className="shrink-0"
              onClick={() => toggleDimension(dimension.id, visible, setVisible)}
            >
              {dimension.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-5 h-[300px] w-full md:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 20, bottom: 8, left: -12 }}>
            <CartesianGrid vertical={false} stroke="#e7dcc8" strokeDasharray="4 4" />
            <XAxis dataKey="ganzhi" tickLine={false} axisLine={false} tickMargin={12} tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip dimensions={report.dimensions} />} />
            {report.dimensions
              .filter((dimension) => visible.includes(dimension.id))
              .map((dimension) => (
                <Line
                  key={dimension.id}
                  type="monotone"
                  dataKey={dimension.id}
                  name={dimension.label}
                  stroke={dimension.color}
                  strokeWidth={3}
                  dot={{ r: 3.5, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
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

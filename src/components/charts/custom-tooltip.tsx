"use client";

import type { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { DimensionDefinition } from "@/lib/schemas/report";

type Props = TooltipProps<ValueType, NameType> & {
  dimensions: DimensionDefinition[];
};

export function CustomTooltip({ active, label, payload, dimensions }: Props) {
  if (!active || !payload || payload.length === 0) return null;
  const firstPayload = payload[0]?.payload as
    | {
        startYear?: number;
        endYear?: number;
        age?: number;
        summary?: string;
      }
    | undefined;

  return (
    <div className="max-w-xs rounded-md border border-fs-line bg-white/95 p-3 text-sm shadow-lg">
      <div className="font-semibold text-fs-ink">{String(label)}</div>
      {firstPayload?.startYear ? (
        <div className="mt-1 text-xs text-fs-muted">
          {firstPayload.startYear}-{firstPayload.endYear}，约 {firstPayload.age}-{Number(firstPayload.age) + 9} 岁
        </div>
      ) : null}
      <div className="mt-2 grid gap-1">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name);
          const dimension = dimensions.find((entry) => entry.id === key);
          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 text-fs-muted">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {dimension?.label ?? item.name}
              </span>
              <span className="font-semibold text-fs-ink">{String(item.value)}</span>
            </div>
          );
        })}
      </div>
      {firstPayload?.summary ? <p className="mt-2 text-xs leading-5 text-fs-muted">{firstPayload.summary}</p> : null}
    </div>
  );
}

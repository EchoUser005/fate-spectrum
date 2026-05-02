import type { ReportResponse } from "@/lib/schemas/report";

const importantPalaces = ["命宫", "财帛", "官禄", "夫妻", "福德", "疾厄"];

export function ZiweiPalaceGrid({ report }: { report: ReportResponse }) {
  const palaces = report.normalized.palaces.filter((palace) => importantPalaces.includes(palace.name));

  return (
    <div className="rounded-md border border-fs-line bg-white p-4">
      <h3 className="font-semibold text-fs-ink">紫微十二宫摘要</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {palaces.map((palace) => (
          <details key={`${palace.index}-${palace.name}`} className="rounded-md border border-fs-line bg-fs-surface p-3">
            <summary className="cursor-pointer font-semibold text-fs-ink">
              {palace.name}
              {palace.branch ? <span className="ml-2 text-sm font-normal text-fs-muted">{palace.branch}</span> : null}
            </summary>
            <div className="mt-3 flex flex-wrap gap-2">
              {palace.stars.slice(0, 8).map((star) => (
                <span key={star} className="rounded-sm bg-white px-2 py-1 text-xs text-fs-muted">
                  {star}
                </span>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

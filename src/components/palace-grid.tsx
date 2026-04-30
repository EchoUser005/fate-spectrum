import type { ReportResponse } from "@/lib/schemas/report";

export function PalaceGrid({ report }: { report: ReportResponse }) {
  const palaces = report.normalized.palaces;

  return (
    <section className="rounded-md bg-white p-5 ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-ink">星盘宫格</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {palaces.length ? (
          palaces.map((palace) => (
            <div key={`${palace.index}-${palace.name}`} className="min-h-32 rounded-md border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-ink">{palace.name}</p>
                <span className="text-xs text-slate-500">{palace.branch}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{palace.stars.slice(0, 8).join(" · ")}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">当前排盘未返回紫微十二宫。</p>
        )}
      </div>
    </section>
  );
}

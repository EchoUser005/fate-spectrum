import type { ReportResponse } from "@/lib/schemas/report";

export function BaziPillars({ report }: { report: ReportResponse }) {
  const pillars = [
    ["年柱", report.normalized.pillars.year],
    ["月柱", report.normalized.pillars.month],
    ["日柱", report.normalized.pillars.day],
    ["时柱", report.normalized.pillars.hour]
  ] as const;

  return (
    <div className="rounded-md border border-fs-line bg-fs-surface p-4">
      <h3 className="font-semibold text-fs-ink">八字四柱</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {pillars.map(([label, value]) => (
          <div key={label} className="rounded-md bg-white p-3 text-center">
            <p className="text-xs text-fs-muted">{label}</p>
            <p className="mt-1 text-xl font-semibold text-fs-ink">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import type { ReportResponse } from "@/lib/schemas/report";

export function BaziPillars({ report }: { report: ReportResponse }) {
  const pillars = [
    ["年柱", report.normalized.pillars.year],
    ["月柱", report.normalized.pillars.month],
    ["日柱", report.normalized.pillars.day],
    ["时柱", report.normalized.pillars.hour]
  ];

  return (
    <section className="rounded-md bg-white p-5 ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-ink">八字四柱</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {pillars.map(([label, value]) => (
          <div key={label} className="rounded-md border border-slate-200 bg-mist p-4 text-center">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

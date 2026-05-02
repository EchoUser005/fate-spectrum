import type { ReportResponse } from "@/lib/schemas/report";

export function KeyWindowPanel({ report }: { report: ReportResponse }) {
  return (
    <section className="rounded-md bg-white p-5 ring-1 ring-slate-200">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Timing Windows</p>
        <h2 className="mt-1 text-xl font-semibold text-ink">值得提前准备的窗口</h2>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {report.narratives.keyWindows.slice(0, 3).map((window) => (
          <article key={window.title} className="rounded-md border border-slate-200 p-4">
            <p className="text-sm font-semibold text-cyan-700">
              {window.startYear}-{window.endYear}
            </p>
            <h3 className="mt-2 text-base font-semibold text-ink">{window.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{window.reason}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

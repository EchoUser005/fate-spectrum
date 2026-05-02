import type { ReportResponse } from "@/lib/schemas/report";

export function ActionPlanPanel({ report }: { report: ReportResponse }) {
  return (
    <section className="rounded-md bg-white p-5 ring-1 ring-slate-200">
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Next Moves</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">接下来可以怎么做</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            这里把光谱解释落到行动，不需要先理解排盘术语。
          </p>
        </div>
        <div className="grid gap-3">
          {report.narratives.actionPlan.map((action, index) => (
            <div key={action} className="flex gap-3 rounded-md bg-mist p-3 text-sm leading-6 text-slate-700">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cyan-700 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <p>{action}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

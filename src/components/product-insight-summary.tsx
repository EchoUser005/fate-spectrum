import { ArrowUpRight, CalendarDays, CheckCircle2, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { ReportResponse } from "@/lib/schemas/report";
import { getCurrentOrNextWindow, getSupportDimension, getTopDimension, getWindowAverage } from "@/lib/report-insights";

export function ProductInsightSummary({ report }: { report: ReportResponse }) {
  const topDimension = getTopDimension(report);
  const supportDimension = getSupportDimension(report);
  const currentWindow = getCurrentOrNextWindow(report);
  const currentAverage = getWindowAverage(report, currentWindow?.scores);
  const keyWindow = report.narratives.keyWindows[0];

  return (
    <section className="rounded-md bg-white p-5 ring-1 ring-slate-200">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Personal Rhythm</p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">先看你的节奏，不看原始数据</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{report.narratives.overview}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Insight
            icon={<CalendarDays size={18} />}
            label="当前主线"
            value={
              currentWindow
                ? `${currentWindow.startYear}-${currentWindow.endYear} · ${currentAverage} 色阶`
                : "等待更多窗口"
            }
            detail="先判断这十年的整体承载力，再看年度变化。"
          />
          <Insight
            icon={<ArrowUpRight size={18} />}
            label="最亮维度"
            value={topDimension ? `${topDimension.label} · ${topDimension.score}` : "暂无"}
            detail={topDimension?.meaning ?? "维度数据不足。"}
          />
          <Insight
            icon={<ShieldAlert size={18} />}
            label="需要稳住"
            value={supportDimension ? `${supportDimension.label} · ${supportDimension.score}` : "暂无"}
            detail="低色阶不等于坏事，它提示需要制度、边界或节奏管理。"
          />
          <Insight
            icon={<CheckCircle2 size={18} />}
            label="优先行动"
            value={keyWindow ? `${keyWindow.startYear}-${keyWindow.endYear}` : "从行动清单开始"}
            detail={report.narratives.actionPlan[0] ?? keyWindow?.reason ?? "先选择一个可执行动作。"}
          />
        </div>
      </div>
    </section>
  );
}

function Insight({
  icon,
  label,
  value,
  detail
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-md bg-mist p-4">
      <div className="flex items-center gap-2 text-cyan-700">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
      <p className="mt-2 text-sm leading-5 text-slate-600">{detail}</p>
    </article>
  );
}

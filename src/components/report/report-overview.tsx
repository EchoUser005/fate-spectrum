"use client";
import type { ReportResponse } from "@/lib/schemas/report";
import { CurrentCycleCard, type CycleSource } from "@/components/report/current-cycle-card";
import { BaziElementBoard } from "@/components/report/bazi-element-board";
import { MainSignalCards } from "@/components/report/main-signal-cards";
import { ZiweiPalaceBoard } from "@/components/report/ziwei-palace-board";
import { cleanGanzhiText } from "@/lib/wuxing";
import { getCurrentDayun } from "@/lib/report-view-model";

export function ReportOverview({
  report,
  chartMode,
  onChartModeChange
}: {
  report: ReportResponse;
  chartMode: CycleSource;
  onChartModeChange: (source: CycleSource) => void;
}) {
  const overview = buildOverview(report);

  return (
    <section id="overview" className="scroll-mt-20 space-y-5">
      <div className="rounded-md border border-fs-line bg-white p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-medium text-fs-gold">{report.birth.nickname || "匿名命盘"}</p>
            <h2 className="mt-2 text-2xl font-semibold text-fs-ink md:text-3xl">总览</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-fs-muted">{overview}</p>
          </div>
          <div className="space-y-3">
            <div className="inline-flex rounded-md border border-fs-line bg-fs-surface p-1">
              {(["bazi", "ziwei"] as const).map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => onChartModeChange(source)}
                  className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                    chartMode === source ? "bg-fs-ink text-white" : "text-fs-muted hover:bg-white hover:text-fs-ink"
                  }`}
                >
                  {source === "bazi" ? "八字" : "紫微"}
                </button>
              ))}
            </div>
            <CurrentCycleCard report={report} source={chartMode} />
          </div>
        </div>
        <div className="mt-5">
          <MainSignalCards report={report} />
        </div>
      </div>
      <div id="chart" className="scroll-mt-24">
        {chartMode === "bazi" ? <BaziElementBoard report={report} /> : <ZiweiPalaceBoard report={report} />}
      </div>
    </section>
  );
}

function trimOverview(value: string) {
  return value.length > 120 ? `${value.slice(0, 118)}...` : value;
}

function buildOverview(report: ReportResponse) {
  const raw = report.narratives.overview.trim();
  const currentDayun = getCurrentDayun(report);
  if (isDisclaimerLike(raw) && currentDayun) {
    return `${cleanGanzhiText(currentDayun.ganzhi)}阶段：${currentDayun.summary}`;
  }
  return trimOverview(raw);
}

function isDisclaimerLike(value: string) {
  return ["本报告基于", "不构成", "免责声明", "医疗", "法律", "投资", "心理诊断"].some((word) =>
    value.includes(word)
  );
}

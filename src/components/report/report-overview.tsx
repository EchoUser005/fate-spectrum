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
  const overviewSections = parseOverviewSections(overview);

  return (
    <section id="overview" className="scroll-mt-20 space-y-5">
      <div className="rounded-md border border-fs-line bg-white p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-medium text-fs-gold">{report.birth.nickname || "匿名命盘"}</p>
            <h2 className="mt-2 text-2xl font-semibold text-fs-ink md:text-3xl">总览</h2>
            <div className="mt-4 max-w-2xl space-y-3">
              {overviewSections.length > 0 ? (
                overviewSections.map((section) => (
                  <div key={section.title} className="border-l-2 border-fs-line pl-3">
                    <p className="text-xs font-semibold text-fs-gold">{section.title}</p>
                    <p className="mt-1 whitespace-pre-line text-sm leading-7 text-fs-muted">{section.body}</p>
                  </div>
                ))
              ) : (
                <p className="whitespace-pre-line text-base leading-7 text-fs-muted">{overview}</p>
              )}
            </div>
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

function buildOverview(report: ReportResponse) {
  const raw = report.narratives.overview.trim();
  const currentDayun = getCurrentDayun(report);
  if (isDisclaimerLike(raw) && currentDayun) {
    return [
      `日主: ${cleanGanzhiText(report.normalized.pillars.day) || report.normalized.pillars.day}日主，先看承载力、调候与十年主线。`,
      `命盘格局: 当前命盘以${currentDayun.summary}为主判，具体强弱需要结合四柱、宫位和流年窗口继续校准。`,
      `喜用神: 优先寻找能提高承载力、恢复力和边界感的信号。`,
      `忌神: 避免被高压、人情、现金流和关系牵动长期消耗。`,
      `当下大环境: ${cleanGanzhiText(currentDayun.ganzhi)}阶段，${currentDayun.startYear}-${currentDayun.endYear}，约${currentDayun.age}-${currentDayun.age + 9}岁。`
    ].join("\n");
  }
  return raw;
}

function isDisclaimerLike(value: string) {
  return ["本报告基于", "不构成", "免责声明", "医疗", "法律", "投资", "心理诊断"].some((word) =>
    value.includes(word)
  );
}

function parseOverviewSections(value: string) {
  const lines = value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const sections: Array<{ title: string; body: string }> = [];

  for (const line of lines) {
    const match = line.match(/^(.{2,8})[:：]\s*(.*)$/);
    if (!match) {
      const last = sections[sections.length - 1];
      if (last) last.body = `${last.body}\n${line}`;
      continue;
    }
    sections.push({ title: match[1], body: match[2] });
  }

  return sections.length >= 2 ? sections : [];
}

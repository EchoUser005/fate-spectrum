import type { ReportResponse } from "@/lib/schemas/report";
import { getReportAnalysis } from "@/lib/analysis/report-analysis";

export function PortraitSummary({ report }: { report: ReportResponse }) {
  const analysis = getReportAnalysis(report);
  const portrait = report.narratives.portrait ?? analysis.portrait;
  const tags = portrait.tags.length > 0 ? portrait.tags : ["结构待校准"];

  return (
    <section className="rounded-md border border-fs-line bg-white p-5 md:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
        <div>
          <p className="text-sm font-medium text-fs-gold">{report.birth.nickname || "匿名命主"}</p>
          <h2 className="mt-2 text-2xl font-semibold text-fs-ink md:text-3xl">总览</h2>
          <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-8 text-fs-muted">
            {portrait.summary}
          </p>
        </div>
        <div className="relative min-h-[220px] overflow-hidden rounded-md border border-fs-line bg-fs-surface p-4">
          <p className="text-xs font-semibold text-fs-gold">格局重点</p>
          <div className="relative mt-4 h-[170px]">
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="absolute inline-flex items-center justify-center rounded-full border border-fs-line bg-white text-center text-sm font-semibold leading-tight text-fs-ink shadow-sm"
                style={getBubbleStyle(index, tags.length)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getBubbleStyle(index: number, total: number) {
  const layout = [
    { left: "8%", top: "8%", size: 92 },
    { left: "46%", top: "0%", size: 118 },
    { left: "26%", top: "48%", size: 104 },
    { left: "66%", top: "48%", size: 86 },
    { left: "2%", top: "58%", size: 76 },
    { left: "70%", top: "14%", size: 72 }
  ];
  const item = layout[index % layout.length];
  const scale = total <= 3 && index === 0 ? 1.12 : 1;
  const size = Math.round(item.size * scale);
  return {
    left: item.left,
    top: item.top,
    width: size,
    height: size
  };
}

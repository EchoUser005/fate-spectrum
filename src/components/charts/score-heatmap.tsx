import type { ReportResponse } from "@/lib/schemas/report";
import { buildDayunHeatmapRows } from "@/lib/report-view-model";

export function ScoreHeatmap({ report }: { report: ReportResponse }) {
  const rows = buildDayunHeatmapRows(report);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-fs-ink">大运色阶图</h3>
          <p className="mt-1 text-sm leading-6 text-fs-muted">颜色越深，代表这一维度在该阶段越容易显影。</p>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto rounded-md border border-fs-line bg-white">
        <div className="grid min-w-[920px]" style={{ gridTemplateColumns: `150px repeat(${report.dayunScores.length}, 1fr)` }}>
          <div className="sticky left-0 z-10 border-b border-fs-line bg-white p-3 text-sm font-medium text-fs-muted">
            维度
          </div>
          {report.dayunScores.map((dayun) => (
            <div key={dayun.ganzhi} className="border-b border-fs-line p-3 text-center text-sm font-semibold text-fs-ink">
              <div>{dayun.ganzhi}</div>
              <div className="mt-1 text-xs font-normal text-fs-muted">{dayun.startYear}</div>
            </div>
          ))}
          {rows.map((row) => (
            <Row key={row.dimensionId} row={row} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ row }: { row: ReturnType<typeof buildDayunHeatmapRows>[number] }) {
  return (
    <>
      <div className="sticky left-0 z-10 border-b border-fs-line bg-white p-3">
        <div className="text-sm font-semibold text-fs-ink">{row.dimensionLabel}</div>
        <div className="mt-1 line-clamp-2 text-xs leading-5 text-fs-muted">{row.dimensionMeaning}</div>
      </div>
      {row.cells.map((cell) => (
        <div key={`${row.dimensionId}-${cell.ganzhi}`} className="border-b border-fs-line p-2">
          <div
            title={`${cell.ganzhi} ${cell.years}：${cell.score}。${cell.summary}`}
            className="rounded-sm px-2 py-3 text-center text-sm font-semibold"
            style={{ backgroundColor: cell.band.color, color: cell.band.textColor }}
          >
            {cell.score}
          </div>
        </div>
      ))}
    </>
  );
}

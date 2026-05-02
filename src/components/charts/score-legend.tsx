import { SCORE_BANDS } from "@/lib/report-view-model";

export function ScoreLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-fs-muted">
      {SCORE_BANDS.map((band) => (
        <span key={band.label} className="inline-flex items-center gap-1">
          <span className="h-2.5 w-5 rounded-sm" style={{ backgroundColor: band.color }} />
          {band.label}
        </span>
      ))}
    </div>
  );
}

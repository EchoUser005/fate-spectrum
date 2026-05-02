import type { ReportResponse } from "@/lib/schemas/report";
import { getHiddenStems, getStemElement, splitGanzhi, wuxingTheme } from "@/lib/wuxing";

const pillarLabels = [
  ["年柱", "year"],
  ["月柱", "month"],
  ["日柱", "day"],
  ["时柱", "hour"]
] as const;

export function BaziElementBoard({ report }: { report: ReportResponse }) {
  return (
    <section className="rounded-md border border-fs-line bg-white p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-fs-gold">四柱五行</p>
          <h2 className="mt-1 text-xl font-semibold text-fs-ink">八字四柱</h2>
        </div>
        {report.normalized.identity.fiveelement ? (
          <span className="rounded-full border border-fs-line bg-fs-surface px-3 py-1 text-sm text-fs-muted">
            {report.normalized.identity.fiveelement}
          </span>
        ) : null}
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {pillarLabels.map(([label, key]) => (
          <PillarCard key={key} label={label} value={report.normalized.pillars[key]} />
        ))}
      </div>
    </section>
  );
}

function PillarCard({ label, value }: { label: string; value: string }) {
  const { stem, branch } = splitGanzhi(value);
  const stemTheme = wuxingTheme[getStemElement(stem)];
  const hiddenStems = getHiddenStems(branch);

  return (
    <div
      className="rounded-lg border px-4 py-4"
      style={{
        borderColor: stemTheme.border,
        background: `linear-gradient(180deg, ${stemTheme.background}, #fffdf8)`
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-fs-muted">{label}</p>
        <span
          className="rounded-full border px-2 py-0.5 text-xs"
          style={{ borderColor: stemTheme.border, color: stemTheme.color }}
        >
          {stemTheme.label}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-4xl font-semibold leading-none" style={{ color: stemTheme.color }}>
          {stem || "-"}
        </span>
        <span className="text-4xl font-semibold leading-none text-fs-ink">{branch || "-"}</span>
      </div>
      <div className="mt-4 flex min-h-7 flex-wrap gap-1.5">
        {hiddenStems.length > 0 ? (
          hiddenStems.map((hiddenStem) => {
            const theme = wuxingTheme[getStemElement(hiddenStem)];
            return (
              <span
                key={hiddenStem}
                className="rounded-full border px-2 py-1 text-xs font-medium"
                style={{
                  borderColor: theme.border,
                  backgroundColor: theme.background,
                  color: theme.color
                }}
              >
                {hiddenStem}
              </span>
            );
          })
        ) : (
          <span className="text-xs text-fs-muted">藏干未返回</span>
        )}
      </div>
    </div>
  );
}

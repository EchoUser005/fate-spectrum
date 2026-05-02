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
      <div className="mt-5 overflow-x-auto pb-1">
        <div className="min-w-[620px] rounded-lg border border-fs-line bg-fs-surface-2">
          <div className="grid grid-cols-[72px_repeat(4,minmax(120px,1fr))] border-b border-fs-line">
            <div className="bg-fs-surface px-3 py-3 text-xs font-medium text-fs-muted">四柱</div>
            {pillarLabels.map(([label]) => (
              <div key={label} className="px-4 py-3 text-center text-sm font-semibold text-fs-ink">
                {label}
              </div>
            ))}
          </div>
          <PillarRow
            label="天干"
            values={pillarLabels.map(([, key]) => report.normalized.pillars[key])}
            part="stem"
          />
          <PillarRow
            label="地支"
            values={pillarLabels.map(([, key]) => report.normalized.pillars[key])}
            part="branch"
          />
          <HiddenStemRow values={pillarLabels.map(([, key]) => report.normalized.pillars[key])} />
        </div>
      </div>
    </section>
  );
}

function PillarRow({
  label,
  values,
  part
}: {
  label: string;
  values: string[];
  part: "stem" | "branch";
}) {
  return (
    <div className="grid grid-cols-[72px_repeat(4,minmax(120px,1fr))] border-b border-fs-line">
      <div className="bg-fs-surface px-3 py-4 text-xs font-medium text-fs-muted">{label}</div>
      {values.map((value, index) => {
        const { stem, branch } = splitGanzhi(value);
        const displayValue = part === "stem" ? stem : branch;
        const theme = wuxingTheme[getStemElement(part === "stem" ? stem : getHiddenStems(branch)[0])];

        return (
          <div key={`${part}-${value}-${index}`} className="px-4 py-4 text-center">
            <span
              className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border text-4xl font-semibold leading-none"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.color
              }}
            >
              {displayValue || "-"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function HiddenStemRow({ values }: { values: string[] }) {
  return (
    <div className="grid grid-cols-[72px_repeat(4,minmax(120px,1fr))]">
      <div className="bg-fs-surface px-3 py-4 text-xs font-medium text-fs-muted">藏干</div>
      {values.map((value, index) => {
        const { branch } = splitGanzhi(value);
        const hiddenStems = getHiddenStems(branch);

        return (
          <div key={`${value}-${index}`} className="flex items-center justify-center gap-1.5 px-3 py-4">
            {hiddenStems.length > 0 ? (
              hiddenStems.map((hiddenStem) => {
                const theme = wuxingTheme[getStemElement(hiddenStem)];
                return (
                  <span
                    key={hiddenStem}
                    className="rounded-full border px-2.5 py-1 text-xs font-semibold"
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
              <span className="text-xs text-fs-muted">-</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

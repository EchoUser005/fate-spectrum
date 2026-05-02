import type { ReportResponse } from "@/lib/schemas/report";
import { cleanProviderText, isGanzhiText } from "@/lib/wuxing";

const palacePositions: Record<number, string> = {
  0: "col-start-1 row-start-1",
  1: "col-start-2 row-start-1",
  2: "col-start-3 row-start-1",
  3: "col-start-4 row-start-1",
  4: "col-start-4 row-start-2",
  5: "col-start-4 row-start-3",
  6: "col-start-4 row-start-4",
  7: "col-start-3 row-start-4",
  8: "col-start-2 row-start-4",
  9: "col-start-1 row-start-4",
  10: "col-start-1 row-start-3",
  11: "col-start-1 row-start-2"
};

const majorStars = new Set(["紫微", "天府", "太阳", "太阴", "武曲", "天相", "天梁", "七杀", "破军", "廉贞", "贪狼", "巨门", "天机"]);
const softBoostStars = new Set(["化禄", "化权", "化科", "禄存", "天马", "文昌", "文曲", "左辅", "右弼", "天魁", "天钺", "红鸾", "天喜"]);
const pressureStars = new Set(["擎羊", "陀罗", "火星", "铃星", "地空", "天刑"]);

export function ZiweiPalaceBoard({ report }: { report: ReportResponse }) {
  const palaces = report.normalized.palaces;
  const center = {
    shenxiao: report.normalized.identity.shenxiao,
    mingzhu: report.normalized.identity.mingzhu,
    shenzhu: report.normalized.identity.shenzhu,
    yinyanggender: report.normalized.identity.yinyanggender
  };

  return (
    <section className="rounded-md border border-fs-line bg-white p-5 md:p-6">
      <div className="mb-5">
        <p className="text-sm font-medium text-fs-gold">十二宫</p>
        <h2 className="mt-1 text-xl font-semibold text-fs-ink">紫微十二宫</h2>
      </div>
      {palaces.length ? (
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[760px] grid-cols-4 grid-rows-4 gap-2">
            <div className="col-span-2 col-start-2 row-span-2 row-start-2 flex min-h-[220px] flex-col justify-center rounded-lg border border-fs-line bg-fs-surface p-5 text-center">
              <p className="text-xs font-semibold tracking-[0.22em] text-fs-gold">FATE SPECTRUM</p>
              <p className="mt-3 text-2xl font-semibold text-fs-ink">星盘</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-fs-muted">
                <CenterLabel label="命主" value={center.mingzhu} />
                <CenterLabel label="身主" value={center.shenzhu} />
                <CenterLabel label="生肖" value={center.shenxiao} />
                <CenterLabel label="阴阳" value={center.yinyanggender} />
              </div>
            </div>
            {palaces.slice(0, 12).map((palace, index) => (
              <PalaceCell key={`${index}-${palace.name}`} palace={palace} className={palacePositions[index] ?? ""} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-fs-line bg-fs-surface px-4 py-6 text-sm text-fs-muted">
          当前排盘未返回紫微十二宫。
        </div>
      )}
    </section>
  );
}

function PalaceCell({
  palace,
  className
}: {
  palace: ReportResponse["normalized"]["palaces"][number];
  className: string;
}) {
  const display = getPalaceDisplay(palace);
  const visibleStars = palace.stars.map(cleanProviderText).filter(Boolean).slice(0, 7);

  return (
    <div className={`min-h-[150px] rounded-lg border border-fs-line bg-fs-surface-2 p-3 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-fs-ink">{display.name}</p>
          <p className="mt-0.5 text-xs text-fs-muted">{display.branch ?? "地支未定"}</p>
        </div>
        <span className="rounded-full bg-fs-bg px-2 py-0.5 text-xs text-fs-muted">{palace.index + 1}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {visibleStars.length ? (
          visibleStars.map((star) => (
            <span key={star} className={starClassName(star)}>
              {star}
            </span>
          ))
        ) : (
          <span className="text-xs text-fs-muted">无主要星曜</span>
        )}
      </div>
    </div>
  );
}

function CenterLabel({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md bg-white/70 px-3 py-2">
      <p className="text-xs text-fs-muted">{label}</p>
      <p className="mt-1 font-semibold text-fs-ink">{cleanProviderText(value) || "-"}</p>
    </div>
  );
}

function getPalaceDisplay(palace: ReportResponse["normalized"]["palaces"][number]) {
  const name = cleanProviderText(palace.name);
  const branch = cleanProviderText(palace.branch);

  if (isGanzhiText(name) && isPalaceName(branch)) {
    return {
      name: branch,
      branch: name
    };
  }

  return {
    name: name || "宫位",
    branch: branch || undefined
  };
}

function isPalaceName(value?: string) {
  const cleanValue = cleanProviderText(value);
  return cleanValue.endsWith("宫") || ["兄弟", "夫妻", "子女", "财帛", "疾厄", "迁移", "仆役", "官禄", "田宅", "福德", "父母"].includes(cleanValue);
}

function starClassName(star: string) {
  const base = "rounded-full border px-2 py-1 text-xs font-medium";
  if (majorStars.has(star)) return `${base} border-[#d8c99f] bg-[#fbf4df] text-[#8a6828]`;
  if (softBoostStars.has(star)) return `${base} border-[#cfe1d2] bg-[#eef6ee] text-[#4f8f63]`;
  if (pressureStars.has(star)) return `${base} border-[#ead0d6] bg-[#fbf0f1] text-[#a54d62]`;
  return `${base} border-fs-line bg-fs-bg text-fs-muted`;
}

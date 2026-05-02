import type { ReportResponse } from "@/lib/schemas/report";
import { BaziPillars } from "@/components/bazi-pillars";
import { PalaceGrid } from "@/components/palace-grid";
import { RawJsonViewer } from "@/components/raw-json-viewer";

export function AdvancedSourceData({ report }: { report: ReportResponse }) {
  return (
    <details className="rounded-md bg-white p-5 ring-1 ring-slate-200">
      <summary className="cursor-pointer text-lg font-semibold text-ink">
        高级源数据：排盘结构与原始 JSON
      </summary>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        这部分给开发者和命理研究者追溯来源；普通用户可以只看前面的节奏、窗口和行动建议。
      </p>
      <div className="mt-5 grid gap-5">
        <BaziPillars report={report} />
        <PalaceGrid report={report} />
        <RawJsonViewer report={report} />
      </div>
    </details>
  );
}

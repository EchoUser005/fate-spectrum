import type { ReportResponse } from "@/lib/schemas/report";

export function RawJsonViewer({ report }: { report: ReportResponse }) {
  return (
    <section className="rounded-md bg-ink p-5 text-white">
      <h2 className="text-lg font-semibold">原始排盘 JSON</h2>
      <pre className="mt-4 max-h-96 overflow-auto rounded-md bg-black/30 p-4 text-xs leading-5 text-slate-100">
        {JSON.stringify(report.rawPaipan, null, 2)}
      </pre>
    </section>
  );
}

import type { ReactNode } from "react";
import type { ReportResponse } from "@/lib/schemas/report";

export function DeveloperDataDrawer({ report }: { report: ReportResponse }) {
  return (
    <section id="developer" className="scroll-mt-20 rounded-md border border-fs-line bg-white p-5 md:p-6">
      <details>
        <summary className="cursor-pointer text-lg font-semibold text-fs-ink">高级数据</summary>
        <p className="mt-2 text-sm leading-6 text-fs-muted">
          以下区域用于调试和多人协作，默认关闭；普通报告不需要阅读这里。
        </p>
        <div className="mt-5 grid gap-4">
          <Panel title="原始排盘 JSON">
            <CodeBlock value={report.rawPaipan} />
          </Panel>
          <Panel title="归一化数据">
            <CodeBlock value={report.normalized} />
          </Panel>
          <Panel title="模型请求摘要">
            <CodeBlock
              value={{
                hasNarrativePolish: report.meta.hasLlmNarrative,
                provider: report.meta.provider,
                generatedAt: report.meta.generatedAt
              }}
            />
          </Panel>
        </div>
      </details>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="rounded-md border border-fs-line bg-fs-bg p-4">
      <summary className="cursor-pointer font-medium text-fs-ink">{title}</summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function CodeBlock({ value }: { value: unknown }) {
  return (
    <pre className="max-h-80 overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

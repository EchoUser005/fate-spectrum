"use client";

import { Download } from "lucide-react";
import type { ReportResponse } from "@/lib/schemas/report";
import { exportReportJson } from "@/lib/export/json";
import { exportReportMarkdown } from "@/lib/export/markdown";
import { downloadTextFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ExportActions({ report }: { report: ReportResponse }) {
  const stamp = report.meta.generatedAt.slice(0, 10);
  return (
    <section className="grid gap-3">
      <p className="text-sm text-slate-500">导出内容包含免责声明，不包含用户 Key。</p>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() =>
            downloadTextFile(`fate-spectrum-${stamp}.json`, exportReportJson(report), "application/json")
          }
        >
          <Download size={16} />
          导出 JSON
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            downloadTextFile(
              `fate-spectrum-${stamp}.md`,
              exportReportMarkdown(report),
              "text/markdown;charset=utf-8"
            )
          }
        >
          <Download size={16} />
          导出光谱报告
        </Button>
      </div>
    </section>
  );
}

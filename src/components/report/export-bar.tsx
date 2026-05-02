"use client";

import { Download } from "lucide-react";
import type { ReportResponse } from "@/lib/schemas/report";
import { exportReportJson } from "@/lib/export/json";
import { exportReportMarkdown } from "@/lib/export/markdown";
import { downloadTextFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ExportBar({ report }: { report: ReportResponse }) {
  const stamp = report.meta.generatedAt.slice(0, 10);

  return (
    <section className="rounded-md border border-fs-line bg-white p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-fs-ink">导出报告</h2>
          <p className="mt-1 text-sm text-fs-muted">导出内容包含免责声明，不包含模型密钥。</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() =>
              downloadTextFile(`mingyun-spectrum-${stamp}.md`, exportReportMarkdown(report), "text/markdown;charset=utf-8")
            }
          >
            <Download size={16} />
            导出报告
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              downloadTextFile(`mingyun-spectrum-${stamp}.json`, exportReportJson(report), "application/json")
            }
          >
            <Download size={16} />
            导出数据
          </Button>
        </div>
      </div>
    </section>
  );
}

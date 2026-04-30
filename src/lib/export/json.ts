import type { ReportResponse } from "@/lib/schemas/report";

export function exportReportJson(report: ReportResponse) {
  return JSON.stringify(report, null, 2);
}

import type { ReportResponse } from "@/lib/schemas/report";
import { ReportShell } from "@/components/report/report-shell";

export function ReportDashboard({ report }: { report: ReportResponse }) {
  return <ReportShell report={report} />;
}

import type { ReportResponse } from "@/lib/schemas/report";
import { GENERAL_DISCLAIMER, HEALTH_DISCLAIMER, WEALTH_DISCLAIMER } from "@/lib/constants";

export function exportReportJson(report: ReportResponse) {
  return JSON.stringify(
    {
      report,
      disclaimers: {
        general: GENERAL_DISCLAIMER,
        health: HEALTH_DISCLAIMER,
        wealth: WEALTH_DISCLAIMER
      }
    },
    null,
    2
  );
}

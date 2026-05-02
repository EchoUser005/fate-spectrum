import type { ReportResponse } from "@/lib/schemas/report";

export async function persistReportSnapshot(params: {
  report: ReportResponse;
  role: "owner" | "guest";
}) {
  const baseUrl = process.env.FATE_MEMORY_API_URL;
  if (!baseUrl) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1200);
  try {
    await fetch(new URL("/profiles/snapshots", baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        role: params.role,
        profileId: params.report.birth.nickname || params.role,
        nickname: params.report.birth.nickname || (params.role === "owner" ? "命主" : "缘主"),
        generatedAt: params.report.meta.generatedAt,
        report: params.report
      }),
      signal: controller.signal
    });
  } catch {
    // Memory persistence is best-effort; report generation must not fail because local storage is offline.
  } finally {
    clearTimeout(timeout);
  }
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearPrimaryReport, loadPrimaryReport } from "@/lib/client/profile-storage";
import type { ReportResponse } from "@/lib/schemas/report";
import { ReportShell } from "@/components/report/report-shell";

export function ChartShell() {
  const router = useRouter();
  const [report] = useState<ReportResponse | null>(() =>
    typeof window === "undefined" ? null : loadPrimaryReport()
  );

  useEffect(() => {
    if (!report) router.replace("/");
  }, [report, router]);

  const resetPrimaryReport = () => {
    clearPrimaryReport();
    router.replace("/");
  };

  if (!report) {
    return (
      <main className="min-h-screen bg-fs-bg px-4 py-10 text-fs-ink">
        <div className="mx-auto max-w-7xl rounded-md border border-fs-line bg-fs-surface-2 p-6 text-sm text-fs-muted">
          正在读取命盘。
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-fs-bg text-fs-ink">
      <section className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <ReportShell report={report} onReset={resetPrimaryReport} />
      </section>
      <footer className="border-t border-fs-line bg-fs-surface px-4 py-6 text-center text-sm text-fs-muted">
        仅供自我反思、娱乐和规划参考。
      </footer>
    </main>
  );
}

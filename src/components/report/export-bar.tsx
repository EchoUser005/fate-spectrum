"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import type { ReportResponse } from "@/lib/schemas/report";
import { Button } from "@/components/ui/button";
import { getCurrentDayun } from "@/lib/report-view-model";

type ShareTarget = "wechat" | "rednote";

const targetLabels: Record<ShareTarget, string> = {
  wechat: "微信",
  rednote: "小红书"
};

export function ShareBar({ report }: { report: ReportResponse }) {
  const [copiedTarget, setCopiedTarget] = useState<ShareTarget | null>(null);

  async function handleShare(target: ShareTarget) {
    const text = buildShareText(report, target);
    const title = "命运光谱报告";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text });
        return;
      } catch {
        // Fall back to clipboard when native sharing is cancelled or unavailable.
      }
    }

    await navigator.clipboard?.writeText(text);
    setCopiedTarget(target);
    window.setTimeout(() => setCopiedTarget(null), 1800);
  }

  return (
    <section className="rounded-md border border-fs-line bg-white px-5 py-4 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-fs-ink">分享报告</h2>
        <div className="flex flex-wrap gap-3">
          {(["wechat", "rednote"] as const).map((target) => (
            <Button key={target} type="button" onClick={() => void handleShare(target)}>
              {copiedTarget === target ? <Check size={16} /> : <Share2 size={16} />}
              {copiedTarget === target ? `已复制${targetLabels[target]}` : `分享到${targetLabels[target]}`}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

function buildShareText(report: ReportResponse, target: ShareTarget) {
  const currentDayun = getCurrentDayun(report);
  const prefix = target === "rednote" ? "我的命运光谱" : "命运光谱";
  const scores = currentDayun
    ? `财富 ${currentDayun.scores.wealth}｜事业 ${currentDayun.scores.career}｜感情 ${currentDayun.scores.relationship}｜舒适 ${currentDayun.scores.comfort}`
    : "多维度人生光谱";
  const summary = currentDayun?.summary ?? report.narratives.overview;

  return [prefix, scores, summary].filter(Boolean).join("\n");
}

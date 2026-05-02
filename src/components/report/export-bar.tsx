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
    const blob = await buildShareImage(report, target);
    const file = new File([blob], `fate-spectrum-${target}.png`, { type: "image/png" });
    const title = "命运光谱报告";

    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title, files: [file] });
        return;
      } catch {
        // Fall back to clipboard/download when native sharing is cancelled or unavailable.
      }
    }

    if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      } catch {
        downloadShareImage(blob, target);
      }
    } else {
      downloadShareImage(blob, target);
    }

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
              {copiedTarget === target ? `已生成${targetLabels[target]}图` : `分享到${targetLabels[target]}`}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

async function buildShareImage(report: ReportResponse, target: ShareTarget) {
  const currentDayun = getCurrentDayun(report);
  const canvas = document.createElement("canvas");
  const width = 1080;
  const height = target === "rednote" ? 1440 : 1350;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("无法生成分享图片。");

  context.fillStyle = "#f7f3ea";
  context.fillRect(0, 0, width, height);
  drawSoftOrb(context, 900, 120, 260, "rgba(181, 138, 53, 0.16)");
  drawSoftOrb(context, 120, 1260, 320, "rgba(31, 143, 138, 0.12)");

  context.fillStyle = "#fffaf2";
  roundRect(context, 58, 58, width - 116, height - 116, 34);
  context.fill();
  context.strokeStyle = "#e7dcc8";
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = "#b58a35";
  context.font = "700 26px Arial";
  context.letterSpacing = "8px";
  context.fillText("FATE SPECTRUM", 96, 134);
  context.letterSpacing = "0px";

  context.fillStyle = "#14231f";
  context.font = "700 58px Arial";
  context.fillText("命运光谱", 96, 210);

  context.fillStyle = "#6b7280";
  context.font = "400 28px Arial";
  drawWrappedText(context, getShareSummary(report), 96, 268, 880, 44, 4);

  if (currentDayun) {
    drawCurrentCycle(context, currentDayun.ganzhi, `${currentDayun.startYear}-${currentDayun.endYear}`, currentDayun.summary);
    drawSignalBars(context, currentDayun.scores);
  }

  context.fillStyle = "rgba(20, 35, 31, 0.08)";
  context.font = "700 104px Arial";
  context.fillText("命运光谱", 450, height - 180);

  context.fillStyle = "#6b7280";
  context.font = "500 24px Arial";
  context.fillText("github.com/EchoUser005/fate-spectrum", 96, height - 96);
  context.fillStyle = "#b58a35";
  context.font = "700 24px Arial";
  context.fillText("EchoUser005", width - 245, height - 96);

  return canvasToBlob(canvas);
}

function drawCurrentCycle(context: CanvasRenderingContext2D, ganzhi: string, years: string, summary: string) {
  context.fillStyle = "#ffffff";
  roundRect(context, 96, 470, 888, 190, 22);
  context.fill();
  context.strokeStyle = "#d7e6df";
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = "#6b7280";
  context.font = "600 24px Arial";
  context.fillText("当前阶段", 134, 525);
  context.fillStyle = "#14231f";
  context.font = "700 54px Arial";
  context.fillText(ganzhi, 134, 590);
  context.fillStyle = "#6b7280";
  context.font = "500 26px Arial";
  context.fillText(years, 282, 588);
  drawWrappedText(context, summary, 134, 628, 780, 34, 2);
}

function drawSignalBars(context: CanvasRenderingContext2D, scores: NonNullable<ReturnType<typeof getCurrentDayun>>["scores"]) {
  const signals = [
    ["财富量级", scores.wealth, "#b58a35"],
    ["事业推进", scores.career, "#315f8f"],
    ["感情关系", scores.relationship, "#c45b73"],
    ["生活舒适度", scores.comfort, "#4f8f63"]
  ] as const;

  let y = 750;
  context.fillStyle = "#14231f";
  context.font = "700 34px Arial";
  context.fillText("主线显影", 96, y);
  y += 62;

  for (const [label, score, color] of signals) {
    context.fillStyle = "#14231f";
    context.font = "700 28px Arial";
    context.fillText(label, 96, y);
    context.fillStyle = "#6b7280";
    context.font = "600 30px Arial";
    context.fillText(String(score), 914, y);
    context.fillStyle = "#f3efe6";
    roundRect(context, 96, y + 22, 820, 14, 7);
    context.fill();
    context.fillStyle = color;
    roundRect(context, 96, y + 22, Math.max(48, (820 * score) / 100), 14, 7);
    context.fill();
    y += 92;
  }
}

function getShareSummary(report: ReportResponse) {
  const currentDayun = getCurrentDayun(report);
  return (currentDayun?.summary ?? report.narratives.overview).replace(/\s+/g, " ").slice(0, 110);
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const chars = text.split("");
  let line = "";
  let lineCount = 0;

  for (const char of chars) {
    const nextLine = `${line}${char}`;
    if (context.measureText(nextLine).width > maxWidth && line) {
      context.fillText(line, x, y + lineCount * lineHeight);
      line = char;
      lineCount += 1;
      if (lineCount >= maxLines) return;
    } else {
      line = nextLine;
    }
  }
  if (line && lineCount < maxLines) context.fillText(line, x, y + lineCount * lineHeight);
}

function roundRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function drawSoftOrb(context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("无法生成分享图片。"));
    }, "image/png");
  });
}

function downloadShareImage(blob: Blob, target: ShareTarget) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fate-spectrum-${target}.png`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

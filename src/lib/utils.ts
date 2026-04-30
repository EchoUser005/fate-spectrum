import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function formatScore(score: number) {
  return `${Math.round(score)}`;
}

export function getScoreTone(score: number) {
  if (score >= 80) return "高能窗口";
  if (score >= 70) return "强势显影";
  if (score >= 60) return "可用";
  if (score >= 50) return "中性";
  return "需要风控";
}

export function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

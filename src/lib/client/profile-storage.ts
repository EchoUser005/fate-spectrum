"use client";

import { ReportResponseSchema, type ReportResponse } from "@/lib/schemas/report";

const PROFILE_STORAGE_KEY = "fate-spectrum.primary-report.v1";

export function savePrimaryReport(report: ReportResponse) {
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(report));
}

export function loadPrimaryReport() {
  const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) return null;
  try {
    return ReportResponseSchema.parse(JSON.parse(stored));
  } catch {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    return null;
  }
}

export function clearPrimaryReport() {
  window.localStorage.removeItem(PROFILE_STORAGE_KEY);
}

export function hasPrimaryReport() {
  return Boolean(window.localStorage.getItem(PROFILE_STORAGE_KEY));
}

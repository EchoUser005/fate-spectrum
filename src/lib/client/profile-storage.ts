"use client";

import { ReportResponseSchema, type ReportResponse } from "@/lib/schemas/report";

const PROFILE_STORAGE_KEY = "fate-spectrum.primary-report.v1";
const PROFILE_COLLECTION_KEY = "fate-spectrum.profile-collection.v1";
const ACTIVE_PROFILE_KEY = "fate-spectrum.active-profile.v1";
const ADD_PROFILE_MODE_KEY = "fate-spectrum.add-profile-mode.v1";

export type ProfileRecord = {
  id: string;
  label: string;
  isPrimary: boolean;
  createdAt: string;
  report: ReportResponse;
};

export function savePrimaryReport(report: ReportResponse) {
  const profile = saveProfileReport(report);
  if (profile.isPrimary) {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(report));
  }
}

export function loadPrimaryReport() {
  const active = loadActiveProfile();
  if (active) return active.report;

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
  window.localStorage.removeItem(PROFILE_COLLECTION_KEY);
  window.localStorage.removeItem(ACTIVE_PROFILE_KEY);
  window.sessionStorage.removeItem(ADD_PROFILE_MODE_KEY);
}

export function hasPrimaryReport() {
  return loadProfiles().length > 0 || Boolean(window.localStorage.getItem(PROFILE_STORAGE_KEY));
}

export function saveProfileReport(report: ReportResponse) {
  const profiles = loadProfiles();
  const hasPrimary = profiles.some((profile) => profile.isPrimary);
  const role = hasPrimary ? "缘主" : "命主";
  const nextProfile: ProfileRecord = {
    id: createProfileId(report),
    label: report.birth.nickname?.trim() || role,
    isPrimary: !hasPrimary,
    createdAt: report.meta.generatedAt,
    report
  };
  const nextProfiles = [...profiles, nextProfile];
  persistProfiles(nextProfiles);
  setActiveProfileId(nextProfile.id);
  if (nextProfile.isPrimary) {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(report));
  }
  return nextProfile;
}

export function loadProfiles(): ProfileRecord[] {
  const stored = window.localStorage.getItem(PROFILE_COLLECTION_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as unknown[];
      const profiles = parsed.map(parseProfileRecord).filter((profile): profile is ProfileRecord => Boolean(profile));
      if (profiles.length > 0) return normalizePrimary(profiles);
    } catch {
      window.localStorage.removeItem(PROFILE_COLLECTION_KEY);
    }
  }

  const legacy = loadLegacyPrimaryReport();
  if (!legacy) return [];
  const migrated: ProfileRecord = {
    id: createProfileId(legacy),
    label: legacy.birth.nickname?.trim() || "命主",
    isPrimary: true,
    createdAt: legacy.meta.generatedAt,
    report: legacy
  };
  persistProfiles([migrated]);
  setActiveProfileId(migrated.id);
  return [migrated];
}

export function loadActiveProfile() {
  const profiles = loadProfiles();
  if (profiles.length === 0) return null;
  const activeId = window.localStorage.getItem(ACTIVE_PROFILE_KEY);
  return profiles.find((profile) => profile.id === activeId) ?? profiles.find((profile) => profile.isPrimary) ?? profiles[0] ?? null;
}

export function setActiveProfileId(id: string) {
  window.localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

export function beginAddProfile() {
  window.sessionStorage.setItem(ADD_PROFILE_MODE_KEY, "true");
}

export function consumeAddProfileMode() {
  const enabled = window.sessionStorage.getItem(ADD_PROFILE_MODE_KEY) === "true";
  if (enabled) window.sessionStorage.removeItem(ADD_PROFILE_MODE_KEY);
  return enabled;
}

function persistProfiles(profiles: ProfileRecord[]) {
  window.localStorage.setItem(PROFILE_COLLECTION_KEY, JSON.stringify(normalizePrimary(profiles)));
}

function parseProfileRecord(value: unknown): ProfileRecord | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<ProfileRecord>;
  if (typeof candidate.id !== "string") return null;
  const parsedReport = ReportResponseSchema.safeParse(candidate.report);
  if (!parsedReport.success) return null;
  return {
    id: candidate.id,
    label: normalizeStoredLabel(candidate.label, Boolean(candidate.isPrimary)),
    isPrimary: Boolean(candidate.isPrimary),
    createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : parsedReport.data.meta.generatedAt,
    report: parsedReport.data
  };
}

function normalizeStoredLabel(label: unknown, isPrimary: boolean) {
  const fallback = isPrimary ? "命主" : "缘主";
  if (typeof label !== "string" || !label.trim()) return fallback;
  const cleanLabel = label.trim();
  if (cleanLabel === "主命主") return "命主";
  if (cleanLabel === "关心的角色") return "缘主";
  return cleanLabel;
}

function normalizePrimary(profiles: ProfileRecord[]) {
  const primaryIndex = profiles.findIndex((profile) => profile.isPrimary);
  const normalizedPrimaryIndex = primaryIndex >= 0 ? primaryIndex : 0;
  return profiles.map((profile, index) => ({
    ...profile,
    isPrimary: index === normalizedPrimaryIndex
  }));
}

function loadLegacyPrimaryReport() {
  const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) return null;
  try {
    return ReportResponseSchema.parse(JSON.parse(stored));
  } catch {
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);
    return null;
  }
}

function createProfileId(report: ReportResponse) {
  const timestamp = new Date(report.meta.generatedAt).getTime() || Date.now();
  return `profile-${timestamp.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

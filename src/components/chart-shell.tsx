"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  beginAddProfile,
  clearPrimaryReport,
  loadActiveProfile,
  loadProfiles,
  setActiveProfileId,
  type ProfileRecord
} from "@/lib/client/profile-storage";
import { ReportShell } from "@/components/report/report-shell";

export function ChartShell() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileRecord[]>(() =>
    typeof window === "undefined" ? [] : loadProfiles()
  );
  const [activeProfile, setActiveProfile] = useState<ProfileRecord | null>(() =>
    typeof window === "undefined" ? null : loadActiveProfile()
  );

  useEffect(() => {
    if (!activeProfile) router.replace("/");
  }, [activeProfile, router]);

  useLayoutEffect(() => {
    if (activeProfile) window.scrollTo({ top: 0, left: 0 });
  }, [activeProfile]);

  const resetPrimaryReport = () => {
    clearPrimaryReport();
    router.replace("/");
  };

  const selectProfile = (id: string) => {
    setActiveProfileId(id);
    const nextProfiles = loadProfiles();
    setProfiles(nextProfiles);
    setActiveProfile(nextProfiles.find((profile) => profile.id === id) ?? null);
  };

  const createProfile = () => {
    beginAddProfile();
    router.push("/");
  };

  if (!activeProfile) {
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
        <ReportShell
          report={activeProfile.report}
          onReset={resetPrimaryReport}
          profiles={profiles.map((profile) => ({
            id: profile.id,
            label: profile.label,
            isPrimary: profile.isPrimary
          }))}
          activeProfileId={activeProfile.id}
          onSelectProfile={selectProfile}
          onCreateProfile={createProfile}
        />
      </section>
      <footer className="border-t border-fs-line bg-fs-surface px-4 py-6 text-center text-sm text-fs-muted">
        仅供自我反思、娱乐和规划参考。
      </footer>
    </main>
  );
}

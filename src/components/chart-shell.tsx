"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  clearPrimaryReport,
  loadActiveProfile,
  loadProfiles,
  saveProfileReport,
  setActiveProfileId,
  syncProfilesFromMemoryApi,
  type ProfileRelationship,
  type ProfileRecord
} from "@/lib/client/profile-storage";
import {
  clearLlmSessionConfig,
  defaultLlmConfig,
  loadLlmSessionConfig,
  saveLlmSessionConfig
} from "@/lib/client/llm-session";
import { ReportShell } from "@/components/report/report-shell";
import { AddProfileModal, ModelConfigModal } from "@/components/report/profile-modals";

export function ChartShell() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileRecord[]>(() =>
    typeof window === "undefined" ? [] : loadProfiles()
  );
  const [activeProfile, setActiveProfile] = useState<ProfileRecord | null>(() =>
    typeof window === "undefined" ? null : loadActiveProfile()
  );
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [isModelConfigOpen, setIsModelConfigOpen] = useState(false);
  const [llmConfig, setLlmConfig] = useState(() =>
    typeof window === "undefined" ? defaultLlmConfig() : loadLlmSessionConfig()
  );

  useEffect(() => {
    let cancelled = false;
    syncProfilesFromMemoryApi()
      .then((nextProfiles) => {
        if (cancelled) return;
        setProfiles(nextProfiles);
        setActiveProfile(loadActiveProfile());
      })
      .finally(() => {
        if (!cancelled) setIsLoadingProfiles(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    saveLlmSessionConfig(llmConfig);
  }, [llmConfig]);

  useEffect(() => {
    if (!isLoadingProfiles && !activeProfile) router.replace("/");
  }, [activeProfile, isLoadingProfiles, router]);

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
    setIsAddProfileOpen(true);
  };

  const saveGeneratedGuest = (report: Parameters<typeof saveProfileReport>[0], relationship?: ProfileRelationship) => {
    const profile = saveProfileReport(report, "guest", { relationship });
    const nextProfiles = loadProfiles();
    setProfiles(nextProfiles);
    setActiveProfile(nextProfiles.find((item) => item.id === profile.id) ?? loadActiveProfile());
    setIsAddProfileOpen(false);
  };

  const clearCachedLlm = () => {
    clearLlmSessionConfig();
    setLlmConfig(defaultLlmConfig());
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
          onOpenModelConfig={() => setIsModelConfigOpen(true)}
        />
      </section>
      <AddProfileModal
        open={isAddProfileOpen}
        llmConfig={llmConfig}
        onClose={() => setIsAddProfileOpen(false)}
        onGenerated={saveGeneratedGuest}
        onOpenModelConfig={() => {
          setIsAddProfileOpen(false);
          setIsModelConfigOpen(true);
        }}
      />
      <ModelConfigModal
        open={isModelConfigOpen}
        llmConfig={llmConfig}
        onLlmChange={setLlmConfig}
        onClearCachedLlm={clearCachedLlm}
        onClose={() => setIsModelConfigOpen(false)}
      />
      <footer className="border-t border-fs-line bg-fs-surface px-4 py-6 text-center text-sm text-fs-muted">
        仅供自我洞察、娱乐和规划参考。
      </footer>
    </main>
  );
}

"use client";

import { ChevronDown, LogOut, Plus, Settings, UserCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import type { ReportResponse } from "@/lib/schemas/report";
import { reportNavItems } from "@/lib/ui-copy/labels";
import { Select } from "@/components/ui/select";
import { ShareButton } from "@/components/report/export-bar";

export function ReportNav({
  onReset,
  profiles = [],
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onOpenModelConfig,
  report,
  onNavigate
}: {
  onReset?: () => void;
  profiles?: Array<{ id: string; label: string; isPrimary: boolean }>;
  activeProfileId?: string;
  onSelectProfile?: (id: string) => void;
  onCreateProfile?: () => void;
  onOpenModelConfig?: () => void;
  report: ReportResponse;
  onNavigate?: (id: string) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const openMenu = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setIsMenuOpen(true);
  };
  const scheduleCloseMenu = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setIsMenuOpen(false), 160);
  };
  const closeMenu = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-30 -mx-4 border-b border-fs-line bg-fs-surface/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-md sm:border">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href="#overview"
          className="inline-flex shrink-0 items-center gap-2 rounded-md border border-fs-line bg-white px-3 py-2 text-sm font-semibold text-fs-ink"
        >
          <span className="tracking-[0.2em] text-fs-gold">FATE SPECTRUM</span>
          <span>命运光谱</span>
        </a>
        <div className="order-last flex w-full min-w-0 gap-1 overflow-x-auto lg:order-none lg:w-auto lg:flex-1">
          {reportNavItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => onNavigate?.(item.id)}
              className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-fs-muted transition hover:bg-white hover:text-fs-ink"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ShareButton report={report} />
          <div
            className="relative"
            onMouseEnter={openMenu}
            onMouseLeave={scheduleCloseMenu}
            onFocus={openMenu}
          >
            <button
              type="button"
              onClick={openMenu}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-fs-line bg-white px-3 text-sm font-medium text-fs-ink transition hover:border-fs-cyan hover:bg-fs-surface"
              aria-label="个人中心"
              aria-expanded={isMenuOpen}
            >
              <UserCircle size={19} />
              <ChevronDown size={15} className="text-fs-muted" />
            </button>
            <div
              className={`absolute right-0 top-full z-40 w-72 pt-2 transition ${
                isMenuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="rounded-md border border-fs-line bg-white p-2 shadow-xl">
                {profiles.length > 0 ? (
                  <label className="mb-2 grid gap-1 border-b border-fs-line p-2 pb-3 text-xs font-medium text-fs-muted">
                    命盘切换
                    <Select
                      value={activeProfileId}
                      onChange={(event) => {
                        onSelectProfile?.(event.target.value);
                        closeMenu();
                      }}
                      className="h-9 w-full"
                      aria-label="命盘切换"
                    >
                      {profiles.map((profile) => (
                        <option key={profile.id} value={profile.id}>
                          {formatProfileLabel(profile)}
                        </option>
                      ))}
                    </Select>
                  </label>
                ) : null}
                <MenuButton
                  icon={<Settings size={16} />}
                  label="模型配置"
                  onClick={() => {
                    onOpenModelConfig?.();
                    closeMenu();
                  }}
                />
                <MenuButton
                  icon={<Plus size={16} />}
                  label="新增命盘"
                  onClick={() => {
                    onCreateProfile?.();
                    closeMenu();
                  }}
                />
                <MenuButton
                  icon={<LogOut size={16} />}
                  label="注销命主"
                  onClick={() => {
                    onReset?.();
                    closeMenu();
                  }}
                  className="text-fs-rose hover:bg-rose-50 hover:text-fs-rose"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  className = ""
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm font-medium text-fs-muted transition hover:bg-fs-surface hover:text-fs-ink disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}

function formatProfileLabel(profile: { label: string; isPrimary: boolean }) {
  const role = profile.isPrimary ? "命主" : "缘主";
  const label = normalizeStoredProfileLabel(profile.label, role);
  return label === role ? role : `${role} · ${label}`;
}

function normalizeStoredProfileLabel(label: string, fallback: string) {
  if (label === "主命主" || label === "关心的角色") return fallback;
  return label || fallback;
}

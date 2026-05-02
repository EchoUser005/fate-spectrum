"use client";

import { Plus } from "lucide-react";
import { reportNavItems } from "@/lib/ui-copy/labels";
import { Select } from "@/components/ui/select";

export function ReportNav({
  onReset,
  profiles = [],
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onNavigate
}: {
  onReset?: () => void;
  profiles?: Array<{ id: string; label: string; isPrimary: boolean }>;
  activeProfileId?: string;
  onSelectProfile?: (id: string) => void;
  onCreateProfile?: () => void;
  onNavigate?: (id: string) => void;
}) {
  return (
    <nav className="sticky top-0 z-30 -mx-4 border-b border-fs-line bg-fs-surface/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-md sm:border">
      <div className="flex flex-wrap items-center gap-3">
        <a href="#overview" className="shrink-0 text-sm font-semibold text-fs-ink">
          <span className="tracking-[0.18em] text-fs-gold">FATE SPECTRUM</span>
          <span className="ml-2">命运光谱</span>
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
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {profiles.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-xs font-medium text-fs-muted">命盘切换</span>
              <Select
                value={activeProfileId}
                onChange={(event) => onSelectProfile?.(event.target.value)}
                className="h-9 w-40 md:w-48"
                aria-label="命盘切换"
              >
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {formatProfileLabel(profile)}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}
          {onCreateProfile ? (
            <button
              type="button"
              onClick={onCreateProfile}
              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-fs-line bg-white px-3 py-2 text-sm font-medium text-fs-muted transition hover:text-fs-ink"
            >
              <Plus size={15} />
              新增命盘
            </button>
          ) : null}
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="shrink-0 rounded-md border border-fs-line bg-white px-3 py-2 text-sm font-medium text-fs-muted transition hover:text-fs-ink"
            >
              注销命主
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

function formatProfileLabel(profile: { label: string; isPrimary: boolean }) {
  const role = profile.isPrimary ? "命主" : "缘主";
  const label = normalizeStoredProfileLabel(profile.label, role);
  return label === role ? role : `${label} · ${role}`;
}

function normalizeStoredProfileLabel(label: string, fallback: string) {
  if (label === "主命主" || label === "关心的角色") return fallback;
  return label || fallback;
}

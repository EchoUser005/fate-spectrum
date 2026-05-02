"use client";

import { reportNavItems } from "@/lib/ui-copy/labels";

export function ReportNav({ onReset }: { onReset?: () => void }) {
  return (
    <nav className="sticky top-0 z-30 -mx-4 border-b border-fs-line bg-fs-surface/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-md sm:border">
      <div className="flex items-center gap-4">
        <a href="#overview" className="shrink-0 text-sm font-semibold text-fs-ink">
          <span className="tracking-[0.18em] text-fs-gold">FATE SPECTRUM</span>
          <span className="ml-2">命运光谱</span>
        </a>
        <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {reportNavItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-fs-muted transition hover:bg-white hover:text-fs-ink"
            >
              {item.label}
            </a>
          ))}
        </div>
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
    </nav>
  );
}

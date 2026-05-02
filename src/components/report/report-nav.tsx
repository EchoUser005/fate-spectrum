"use client";

import { reportNavItems } from "@/lib/ui-copy/labels";

export function ReportNav() {
  return (
    <nav className="sticky top-0 z-30 -mx-4 border-y border-fs-line bg-fs-surface/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-md sm:border">
      <div className="flex gap-2 overflow-x-auto">
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
    </nav>
  );
}

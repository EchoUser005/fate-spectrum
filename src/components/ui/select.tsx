import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const chevronIcon =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.25' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, style, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full cursor-pointer appearance-none rounded-md border border-fs-line bg-fs-surface-2 px-3 pr-10 text-sm font-medium text-fs-ink shadow-[0_1px_0_rgba(31,41,55,0.04)] outline-none transition hover:border-[#d8cbb6] hover:bg-white focus:border-fs-cyan focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-fs-bg disabled:text-fs-muted",
        "[&>option]:bg-fs-surface-2 [&>option]:text-fs-ink",
        className
      )}
      style={{
        backgroundImage: chevronIcon,
        backgroundPosition: "right 0.75rem center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "18px 18px",
        ...style
      }}
      {...props}
    />
  )
);
Select.displayName = "Select";

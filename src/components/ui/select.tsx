import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-ink outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";

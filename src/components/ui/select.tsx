import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-10 w-full rounded-md border border-fs-line bg-white px-3 text-sm text-fs-ink outline-none transition focus:border-fs-cyan focus:ring-2 focus:ring-cyan-100",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";

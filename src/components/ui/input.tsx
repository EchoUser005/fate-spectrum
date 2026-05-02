import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-10 w-full rounded-md border border-fs-line bg-white px-3 text-sm text-fs-ink outline-none transition placeholder:text-slate-400 focus:border-fs-cyan focus:ring-2 focus:ring-cyan-100",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

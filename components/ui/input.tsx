import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 selection:bg-primary selection:text-primary-foreground",
        "bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700",
        "h-10 w-full min-w-0 rounded-lg px-4 py-2 text-base text-slate-900 dark:text-slate-100",
        "shadow-sm dark:shadow-lg transition-all duration-200 outline-none cursor-text",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md dark:hover:shadow-lg",
        "focus-visible:border-indigo-500 dark:focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:focus-visible:ring-indigo-400/30 focus-visible:shadow-lg dark:focus-visible:shadow-indigo-500/20",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

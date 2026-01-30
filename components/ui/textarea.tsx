import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-slate-400 dark:placeholder:text-slate-500",
        "bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100",
        "min-h-24 w-full rounded-lg px-4 py-3 text-base shadow-sm dark:shadow-lg",
        "transition-all duration-200 outline-none resize-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
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

export { Textarea };

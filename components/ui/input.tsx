import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // 16px text below md stops iOS zooming into the field on focus.
        "h-control-md w-full min-w-0 rounded-md border-2 border-input bg-surface-input px-3 py-1 text-body-lg text-ink transition-colors outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-body-strong file:text-ink placeholder:text-ink-muted hover:bg-surface-hover disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-body",
        // Focus: the 2px border turns brand-600 (no outline, so it isn't doubled).
        "focus-visible:border-ring focus-visible:bg-surface",
        "aria-invalid:border-danger",
        className
      )}
      {...props}
    />
  )
}

export { Input }

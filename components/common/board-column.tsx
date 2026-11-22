import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BoardColumnProps = {
  title: string;
  count: number;
  /** `default` on light pages, `inverse` on brand-900 panels */
  tone?: "default" | "inverse";
  children?: ReactNode;
  className?: string;
};

/** A board column: uppercase title + count, then a stack of TaskCards. */
export function BoardColumn({ title, count, tone = "default", children, className }: BoardColumnProps) {
  return (
    <section
      aria-label={`${title}, ${count} tasks`}
      className={cn(
        "flex flex-col gap-2 rounded-lg p-2",
        tone === "inverse" ? "bg-brand-800 text-on-brand-muted" : "bg-surface-sunken text-ink-muted",
        className,
      )}
    >
      <header className="flex items-center justify-between px-1 pt-1 pb-0.5">
        <h2 className="text-overline uppercase">{title}</h2>
        <span className="text-label">{count}</span>
      </header>
      {children}
    </section>
  );
}

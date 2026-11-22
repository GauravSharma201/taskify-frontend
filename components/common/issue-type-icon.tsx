import { Bookmark, Check, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const TYPES = {
  story: { label: "Story", bg: "bg-success", Icon: Bookmark },
  bug: { label: "Bug", bg: "bg-danger", Icon: Circle },
  task: { label: "Task", bg: "bg-brand-600", Icon: Check },
} as const;

export type IssueType = keyof typeof TYPES;

/** 16px coloured square showing a task's type (story, bug, task). */
export function IssueTypeIcon({ type, className }: { type: IssueType; className?: string }) {
  const { label, bg, Icon } = TYPES[type];

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn("inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-on-brand", bg, className)}
    >
      <Icon
        aria-hidden="true"
        className="size-2.5"
        strokeWidth={type === "task" ? 3.5 : 2}
        fill={type === "task" ? "none" : "currentColor"}
      />
    </span>
  );
}

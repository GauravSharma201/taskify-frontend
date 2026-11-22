import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type IconBadgeProps = {
  icon: LucideIcon;
  className?: string;
};

/** Decorative icon in a light-blue circle, above a card title (e.g. lock on "Can't log in?"). */
export function IconBadge({ icon: Icon, className }: IconBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid size-15 shrink-0 place-content-center rounded-full bg-brand-100 text-brand-600", className)}
    >
      <Icon className="size-6" />
    </span>
  );
}

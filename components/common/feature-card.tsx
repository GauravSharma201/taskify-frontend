import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

/** Feature highlight for brand-900 panels: white icon tile, then title and description. */
export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={cn("flex items-start gap-3 rounded-lg bg-brand-800 p-4", className)}>
      <span className="grid size-9 shrink-0 place-content-center rounded-md bg-surface text-brand-900">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="flex flex-col gap-0.5">
        <h2 className="text-title-sm text-on-brand">{title}</h2>
        <p className="text-body text-on-brand-muted">{description}</p>
      </div>
    </div>
  );
}

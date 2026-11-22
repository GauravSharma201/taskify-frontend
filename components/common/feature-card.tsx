import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type FeatureCardProps = {
  title: string;
  /** Optional second line. Without it the card is a single centred row. */
  description?: string;
  className?: string;
} & (
  | { /** White square tile with this icon (sign-up feature list) */ icon: LucideIcon; step?: never }
  | { /** Round white marker with this number (numbered steps, e.g. forgot password) */ step: number; icon?: never }
);

/** Feature highlight or numbered step for brand-900 panels: white marker, then title and optional description. */
export function FeatureCard({ icon: Icon, step, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg bg-brand-800 p-4",
        description ? "items-start" : "items-center",
        className,
      )}
    >
      {Icon ? (
        <span className="grid size-9 shrink-0 place-content-center rounded-md bg-surface text-brand-900">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      ) : (
        <span className="grid size-8 shrink-0 place-content-center rounded-full bg-surface text-body-strong text-brand-900">
          {step}
        </span>
      )}
      {description ? (
        <div className="flex flex-col gap-0.5">
          <h2 className="text-title-sm text-on-brand">{title}</h2>
          <p className="text-body text-on-brand-muted">{description}</p>
        </div>
      ) : (
        <p className="text-title-sm font-medium text-on-brand">{title}</p>
      )}
    </div>
  );
}

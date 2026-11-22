import { cn } from "@/lib/utils";

type LogoProps = {
  /** `full` = mark + wordmark, `mark` = the square only */
  variant?: "full" | "mark";
  /** `default` for light surfaces, `inverse` for brand-900 panels */
  tone?: "default" | "inverse";
  className?: string;
};

/**
 * Taskify logo. Drawn inline (not <img>) so the colours can follow `tone`.
 * Geometry matches public/brand/taskify-mark.svg.
 */
export function Logo({ variant = "full", tone = "default", className }: LogoProps) {
  const inverse = tone === "inverse";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3",
        inverse ? "text-on-brand" : "text-ink",
        className,
      )}
    >
      <svg
        viewBox="0 0 32 32"
        className="size-8 shrink-0"
        role={variant === "mark" ? "img" : undefined}
        aria-label={variant === "mark" ? "Taskify" : undefined}
        aria-hidden={variant === "mark" ? undefined : true}
      >
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="7"
          className={inverse ? "fill-on-brand" : "fill-brand-900"}
        />
        <path
          d="M9 16.5l4.5 4.5L23 11"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={inverse ? "stroke-brand-900" : "stroke-on-brand"}
        />
      </svg>
      {variant === "full" && <span className="text-heading-2 font-bold">Taskify</span>}
    </span>
  );
}

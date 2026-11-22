import Link from "next/link";
import type { ComponentProps } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TextLinkProps = ComponentProps<typeof Link> & {
  /** `default` = brand-600 semibold, `muted` = quiet footer-style link */
  variant?: "default" | "muted";
};

/**
 * In-text navigation link. The `default` style is shared with
 * <Button variant="link" size="inline">, so links and link-buttons match.
 */
export function TextLink({ variant = "default", className, ...props }: TextLinkProps) {
  return (
    <Link
      className={cn(
        variant === "default"
          ? buttonVariants({ variant: "link", size: "inline" })
          : "rounded-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline",
        className,
      )}
      {...props}
    />
  );
}

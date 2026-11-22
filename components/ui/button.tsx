import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// Focus ring comes from the global :focus-visible rule in app/globals.css (2px brand-600).
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-body-strong whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-brand-800 active:bg-brand-900",
        destructive: "bg-destructive text-on-brand hover:bg-danger-text",
        outline:
          "border-2 border-input bg-surface text-ink hover:bg-surface-hover active:bg-border",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-border",
        ghost: "text-ink hover:bg-surface-hover active:bg-border",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-control-md px-4 has-[>svg]:px-3",
        xs: "h-6 gap-1 px-2 text-label has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-control-sm gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-control-lg px-5 has-[>svg]:px-4",
        /** No box: for link-style actions inside text or inputs ("Show", "Forgot password?") */
        inline: "h-auto gap-1 rounded-sm p-0",
        icon: "size-control-md",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-control-sm",
        "icon-lg": "size-control-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

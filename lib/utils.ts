import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Custom design-system utilities defined in app/globals.css.
 * tailwind-merge must know them, otherwise e.g. `text-body` (a font size)
 * is treated as a colour and `cn("text-body", "text-ink")` drops one of them.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "page-title",
        "heading-1",
        "heading-2",
        "heading-3",
        "title-sm",
        "body",
        "body-strong",
        "body-lg",
        "small",
        "label",
        "caption",
        "overline",
        "code",
      ],
      shadow: ["card", "raised", "menu", "overlay", "panel"],
      radius: ["pill"],
      spacing: ["control-sm", "control-md", "control-lg", "header", "sidebar"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

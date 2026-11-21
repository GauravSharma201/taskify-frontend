# Taskify: shadcn setup + design-system theme

## Context
The Next.js 16 app is a fresh scaffold (Geist fonts, default `globals.css`). The user wants to build the UI with shadcn/ui and grow a reusable component library screen by screen. This step only sets up shadcn and the **styling and theme** from the Taskify Design System artifact. No components are built yet; those come later, one screen at a time.

Decisions:
- **Light theme only.** Keep an empty `.dark` hook so dark mode can be added later.
- **Naming follows the journey doc:** Organisation > Workspace > Project > Task. This matters when screens are built, not for the theme.

Project facts:
- npm (`package-lock.json`).
- Tailwind v4 runs through the `@tailwindcss/turbopack` loader in `next.config.ts`. There is no PostCSS config, and none should be added.
- The `@/*` path alias already maps to the repo root.

## Steps

### 1. shadcn plumbing (set up by hand, not with `shadcn init`)
`init` may add a PostCSS config and overwrite `globals.css`, so it is set up manually:
- `npm i clsx tailwind-merge class-variance-authority lucide-react tw-animate-css`
- `components.json`: style `new-york`, `rsc: true`, `tsx: true`, `tailwind.config: ""`, `tailwind.css: "app/globals.css"`, `cssVariables: true`, `iconLibrary: "lucide"`. Aliases: `components → @/components`, `ui → @/components/ui`, `utils → @/lib/utils`, `lib → @/lib`, `hooks → @/hooks`.
- `lib/utils.ts`: the standard `cn()` helper (clsx + tailwind-merge).
- Folders for the library, empty with a `.gitkeep`:
  - `components/ui/`: raw shadcn primitives (CLI output, edited only to match tokens)
  - `components/common/`: Taskify composites (StatusLozenge, Avatar, TaskCard…)
  - `components/layout/`: app shell pieces (Sidebar, TopNav…)

### 2. Theme: rewrite `app/globals.css`
Structure: `@import "tailwindcss"; @import "tw-animate-css"; @custom-variant dark (&:is(.dark *));`, then `:root` tokens, then `@theme inline`, then `@layer base`.

**shadcn semantic variables, mapped to design-system tokens (exact hex):**

| shadcn var | DS token | value |
|---|---|---|
| background / card / popover | surface | #FFFFFF |
| foreground / card-fg / popover-fg | ink | #172B4D |
| primary / ring | brand-600 | #1D5FD6 |
| primary-foreground | on-brand | #FFFFFF |
| secondary / secondary-fg | surface-hover / ink | #F1F2F4 / #172B4D |
| muted / muted-foreground | surface-sunken / ink-muted | #F7F8F9 / #44546F |
| accent / accent-foreground | brand-100 / brand-900 | #E9F2FF / #0B3D91 |
| destructive | danger | #C9372C |
| border / input | border | #DFE1E6 |
| chart-1/2/3 | chart-1 / chart-2 / chart-ideal | #2A78D6 / #EB6834 / #8590A2 |
| sidebar, -foreground | surface-sunken, ink | |
| sidebar-primary, -accent, -accent-fg, -border, -ring | brand-600, brand-100, brand-900, border, brand-600 | |

**Taskify tokens, also exposed as Tailwind colours** (`--color-*`, giving e.g. `bg-brand-900`, `text-ink-muted`, `bg-status-done-bg`): brand-900/800/600/100, ink, ink-muted, ink-subtle, on-brand, on-brand-muted, surface, surface-sunken, surface-input, surface-hover, border-strong, overlay, status-{todo,progress,review,done}-{bg,fg}, success, danger, danger-text, warning-bg, warning-text, priority-medium, avatar-1…5, chart-ideal.

**Radius:** set explicitly instead of shadcn's calc chain: `--radius-sm 3px`, `--radius-md 4px` (controls), `--radius-lg 6px`, `--radius-xl 8px`, `--radius-pill 16px`. `rounded-full` already exists.

**Shadows:** `--shadow-card`, `--shadow-raised`, `--shadow-menu`, `--shadow-overlay`, `--shadow-panel`, using the design-system values. These give `shadow-card` and similar utilities.

**Sizes:** `--spacing-control-sm 32px`, `--spacing-control-md 40px`, `--spacing-control-lg 44px`, `--spacing-header 56px`, `--spacing-sidebar 240px`. These give `h-control-md`, `w-sidebar` and similar utilities. Tailwind's default 4px spacing scale already matches `space-1…12`, so it needs no override.

**Type scale** via `--text-<name>` with `--line-height`, `--font-weight` and `--letter-spacing` sub-vars: display 34/41/700/-0.5px, page-title 26/32/600, heading-1 24/30/600, heading-2 20/26/600, heading-3 16/22/600, title-sm 15/20/600, body 14/20/400, body-strong 14/20/600, body-lg 16/24/400, small 13/18/400, label 12/16/600, caption 12/16/400, overline 11/14/700/0.5px, code 13/20 mono. Usage: `text-body`, `text-overline uppercase`.

**Fonts:** `--font-sans: var(--font-inter), system-ui, …` and `--font-mono: var(--font-jetbrains-mono), ui-monospace, …`.

**Base layer:** `* { @apply border-border outline-ring/50 }`, and `body { @apply bg-background text-foreground font-sans text-body antialiased }`. Focus ring: 2px `ring` (brand-600), per the design system.

`.dark {}` stays as a commented stub.

### 3. Fonts and metadata: `app/layout.tsx`
- Replace Geist with `Inter` (`--font-inter`) and `JetBrains_Mono` (`--font-jetbrains-mono`) from `next/font/google`, both with `display: "swap"`. Check the API in `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` first, as AGENTS.md requires.
- Metadata: title template `%s · Taskify`, default `Taskify`, and a real description.

### 4. Brand assets
- `public/brand/taskify-logo.svg` and `public/brand/taskify-mark.svg`, copied byte-for-byte from the design system's Logos group.
- `app/icon.svg` = the mark, which uses Next's file-based icon. Remove `app/favicon.ico`.

### 5. Theme preview page (dev aid, not a component)
`app/(dev)/theme/page.tsx`: plain JSX showing every colour swatch with its name, the full type scale, radii, shadows and the logo. Use it to check the tokens and as the reference while building the library. It can be deleted later.

### 6. Component inventory tracker
`docs/component-inventory.md`: a table of screens (from the journey doc) → the components each needs. Each component is marked shadcn primitive or custom composite, with a status of todo, in progress or done. Pre-fill the screen list. Leave every status at todo. This supports the screen-by-screen workflow.

## Files
- New: `components.json`, `lib/utils.ts`, `components/{ui,common,layout}/.gitkeep`, `public/brand/*.svg`, `app/icon.svg`, `app/(dev)/theme/page.tsx`, `docs/component-inventory.md`
- Changed: `app/globals.css` (rewritten), `app/layout.tsx`, `package.json` (deps)
- Removed: `app/favicon.ico`
- Untouched: `next.config.ts` (keep the turbopack Tailwind loader; no PostCSS file)

## Verification
1. `npm run build` passes, and `npm run lint` is clean.
2. `npm run dev`, then open `/theme`. Swatches match the design-system hex values, text is Inter, and the code sample is JetBrains Mono.
3. Sanity-check the shadcn CLI against our config: `npx shadcn@latest add button --dry-run`, or add Button to a scratch branch and delete it after. Confirm it resolves to `components/ui`, uses `bg-primary` = #1D5FD6, and leaves `globals.css` and the PostCSS setup alone. Nothing from the component list is kept.

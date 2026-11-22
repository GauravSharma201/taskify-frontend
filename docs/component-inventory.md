# Component inventory

The registry of every UI component, kept up to date so the library grows screen by screen and nothing is built twice.

- **Source of screens:** the Taskify user journey doc.
- **Source of styles:** the Taskify Design System. Its tokens are in `app/globals.css` and previewed at `/theme`.
- **Naming:** Organisation › Workspace › Project › Task.

## Workflow (for every new screen)

1. **Break it down.** List every UI element on the screen, using the names in this registry where one fits.
2. **Classify** each element:

   | Bucket | Meaning | Example |
   | --- | --- | --- |
   | **Reuse** | Exists and already looks and behaves this way | Login uses `Input`, already built on Signup |
   | **Extend** | Exists, but needs a new variant, size or prop | `Button` exists; Login needs a `link` variant |
   | **New** | Nothing in the registry does this job | A divider with "or" text |

   Rule: **same job, different look means Extend, not New.** A smaller blue button is `Button size="sm"`, not `SmallButton`.
3. **Check the code.** Before calling anything New, search `components/ui`, `components/common` and `components/layout`. If the code has it but this file doesn't, fix this file.
4. **Confirm.** Share the Reuse / Extend / New table and get approval before building.
5. **Register.** After building, in the same change: set Status, confirm Path, fill in **Variants / props** and **Looks like**, and update the screen's row below. Then add or update the component's demo on the `/components` gallery (`app/(dev)/components/page.tsx`) with every variant and state.

## Where components live

| Folder | What goes there |
| --- | --- |
| `components/ui/` | Raw shadcn primitives (`npm run ui:add -- <name>`), adjusted only to use our tokens |
| `components/common/` | Taskify composites built from primitives (StatusLozenge, UserAvatar, TaskCard…) |
| `components/layout/` | App shell pieces (AppSidebar, TopNav, AuthLayout…) |

Status: `todo` · `in progress` · `done`

**Adding shadcn primitives:** use `npm run ui:add -- <name>`, not `npx shadcn add`. shadcn's registry now imports `cn` from an npm package called `cn`. Our `cn` in `lib/utils.ts` knows the design-system classes (`text-body`, `shadow-card`…), so the wrapper points the imports back at `@/lib/utils` and removes that package. Then align the new file with the tokens:
- Sizes use `h-control-*`.
- Text uses the type scale, not `text-sm`.
- Delete shadcn's `focus-visible:ring-*`/`outline-none`, so the global 2px brand focus outline applies. Inputs are the exception: their focus state is a brand-600 border.

## Library

- **Path:** the planned file until Status is `done`, then the real one.
- **Variants / props:** what exists in code, such as `variant: default, secondary, link · size: sm, md, lg`. This is what decides Reuse vs Extend.
- **Looks like:** a one-line visual description, so a screenshot can be matched by appearance, not only by name.
- `—` means not built yet.

| Component | Kind | Path | Variants / props | Looks like | Used on screens | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Button | shadcn | `components/ui/button.tsx` | `variant`: default, outline, secondary, ghost, destructive, link · `size`: xs, sm (32), default (40), lg (44), inline (no box), icon, icon-xs, icon-sm, icon-lg · `asChild` (wrap a `next/link`) | default: solid brand-600, white 14/600 text, 4px radius, darker on hover. outline: white with 2px grey border, ink text. link: brand-600 semibold text | all | done |
| Input | shadcn | `components/ui/input.tsx` | standard `<input>` props; `aria-invalid` turns the border red | 40px, very light grey fill (#FAFBFC), 2px grey border, 4px radius; border turns brand-600 and fill white on focus | auth, onboarding, settings, dialogs | done |
| Label | shadcn | `components/ui/label.tsx` | `required` (red asterisk) | 12px semibold ink-muted text, optional red `*` | all forms | done |
| PasswordInput | composite | `components/common/password-input.tsx` | all Input props except `type` | Input with a brand-600 "Show / Hide" text toggle inside on the right | signup, login, invite, reset, settings | done |
| Select | shadcn | `components/ui/select.tsx` | — | — | onboarding, settings, task drawer | todo |
| Checkbox | shadcn | `components/ui/checkbox.tsx` | Radix checkbox props; `name` submits `"on"` in forms | 16px, 3px radius, grey outline; checked = solid brand-600 with white tick | login, task rows, subtasks, settings | done |
| Textarea | shadcn | `components/ui/textarea.tsx` | — | — | create workspace/project, task description | todo |
| Field (replaces Form) | shadcn | `components/ui/field.tsx` | `Field` (`orientation`: vertical, horizontal, responsive; `data-invalid`), `FieldLabel` (+`required`), `FieldError`, `FieldDescription`, `FieldGroup`, `FieldSet`, `FieldLegend`, `FieldSeparator` (optional centre text, e.g. "or") | label above control, red 13px error below; FieldSeparator = thin grey line with small grey text in the middle | all forms | done |
| InputOTP | shadcn | `components/ui/input-otp.tsx` | — | — | verify email, 2FA | todo |
| Card | shadcn | `components/ui/card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` | white, 8px radius, 1px border, `shadow-card`; auth card adds `shadow-raised` | login card, stat tiles, project cards | done |
| Dialog | shadcn | `components/ui/dialog.tsx` | — | — | create workspace, create project, quick add task, confirms | todo |
| Sheet | shadcn | `components/ui/sheet.tsx` | — | — | task drawer, mobile sidebar | todo |
| DropdownMenu | shadcn | `components/ui/dropdown-menu.tsx` | — | — | org switcher, user menu, row actions | todo |
| Popover | shadcn | `components/ui/popover.tsx` | — | — | date picker, assignee picker | todo |
| Command | shadcn | `components/ui/command.tsx` | — | — | Ctrl/⌘K palette, assignee/label pickers | todo |
| Calendar / DatePicker | shadcn | `components/ui/calendar.tsx` | — | — | due dates, calendar view | todo |
| Tabs | shadcn | `components/ui/tabs.tsx` | — | — | My Work, workspace, project views, task drawer | todo |
| Table | shadcn | `components/ui/table.tsx` | — | — | members, list view | todo |
| Badge | shadcn | `components/ui/badge.tsx` | — | — | counts, labels | todo |
| Avatar | shadcn | `components/ui/avatar.tsx` | `size`: sm (24), default (32), lg (40) · `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount` | round; use UserAvatar instead of this directly | everywhere people appear | done |
| Tooltip | shadcn | `components/ui/tooltip.tsx` | — | — | icon buttons | todo |
| Progress | shadcn | `components/ui/progress.tsx` | — | — | project cards, subtasks, onboarding | todo |
| Separator | shadcn | `components/ui/separator.tsx` | `orientation`: horizontal, vertical · for a line with text in the middle use `FieldSeparator` | 1px border-colour line | login card footer, menus, panels | done |
| Skeleton | shadcn | `components/ui/skeleton.tsx` | — | — | every loading state | todo |
| Sonner (toast) | shadcn | `components/ui/sonner.tsx` | — | — | undo, saved, errors | todo |
| Alert | shadcn | `components/ui/alert.tsx` | — | — | section messages | todo |
| Sidebar | shadcn | `components/ui/sidebar.tsx` | — | — | app shell | todo |
| Breadcrumb | shadcn | `components/ui/breadcrumb.tsx` | — | — | top bar | todo |
| ScrollArea | shadcn | `components/ui/scroll-area.tsx` | — | — | board columns, drawer | todo |
| Logo | composite | `components/common/logo.tsx` | `variant`: full, mark · `tone`: default, inverse | 32px rounded square with a check mark, plus bold "Taskify" wordmark. default: navy square, white tick, ink text. inverse: white square, navy tick, white text | auth, app shell | done |
| TextLink | composite | `components/common/text-link.tsx` | `variant`: default, muted · all `next/link` props | default: brand-600 semibold, underline on hover (same as Button link). muted: grey text, ink on hover | login (Forgot password, Create an account, legal footer) | done |
| StatusLozenge | composite | `components/common/status-lozenge.tsx` | — | — | board, list, drawer, My Work | todo |
| PriorityIcon | composite | `components/common/priority-icon.tsx` | — | — | task rows, cards, drawer | todo |
| IssueTypeIcon | composite | `components/common/issue-type-icon.tsx` | `type`: story, bug, task | 16px coloured square, 3px radius, white glyph: green + bookmark (story), red + dot (bug), blue + tick (task) | login brand panel, task cards, rows, drawer | done |
| UserAvatar | composite | `components/common/user-avatar.tsx` | `name`, `src?`, `size`: sm, default, lg · `color?`: 1–5 (default is picked from the name) | round, white bold initials on avatar-1…5 (purple, teal, orange, green, red) | login brand panel, task cards, members | done |
| AvatarStack | composite | `components/common/avatar-stack.tsx` (build on `AvatarGroup` + UserAvatar) | — | — | workspace header, project cards | todo |
| StatTile | composite | `components/common/stat-tile.tsx` | — | — | My Work | todo |
| TaskRow | composite | `components/common/task-row.tsx` | — | — | My Work, list view | todo |
| TaskCard | composite | `components/common/task-card.tsx` | `title`, `taskKey`, `type` (IssueType), `assignee?`: { name, src?, color? } | white, 6px radius, `shadow-card`, 12px padding; 14px title, then type icon + grey key on the left, 24px avatar on the right | login brand panel, board | done |
| ProjectCard | composite | `components/common/project-card.tsx` | — | — | workspace overview | todo |
| BoardColumn | composite | `components/common/board-column.tsx` | `title`, `count`, `tone`: default, inverse · children = cards | 6px radius, 8px padding, uppercase 11px bold title with count on the right. default: light grey (#F7F8F9). inverse: brand-800 blue | login brand panel, board | done |
| FormTextField | composite (Formik) | `components/common/form-text-field.tsx` | `name` (Formik field + input id), `label`, `required?`, `labelAside?` (e.g. a Forgot password link), plus Input props except `id`/`value`/`onChange`/`onBlur` · render inside `<Formik>` | Field + Label above an Input; red 13px error under it once the field is touched (red border, `aria-invalid`) | login | done |
| FormPasswordField | composite (Formik) | `components/common/form-text-field.tsx` | same as FormTextField, with PasswordInput props | FormTextField with the PasswordInput "Show / Hide" toggle | login | done |
| FormCheckbox | composite (Formik) | `components/common/form-checkbox.tsx` | `name` (boolean Formik field), `label`, `disabled?` · render inside `<Formik>` | Checkbox with a 14px ink label to its right | login | done |
| FormErrorBanner + FocusFirstError | composite (Formik) | `components/common/form-error-banner.tsx` | FormErrorBanner: shows Formik `status.formError` · FocusFirstError: no props, renders nothing; place inside `<Form>` | banner: warning-bg box, 13px warning-text, 4px radius | login | done |
| EmptyState | composite | `components/common/empty-state.tsx` | — | — | every list | todo |
| FilterChip | composite | `components/common/filter-chip.tsx` | — | — | board/list filters, inbox filters | todo |
| NotificationItem | composite | `components/common/notification-item.tsx` | — | — | inbox | todo |
| Stepper | composite | `components/common/stepper.tsx` | — | — | onboarding wizard | todo |
| AuthLayout (brand panel + form card) | layout | `components/layout/auth-layout.tsx` (used by `app/(auth)/layout.tsx`) | `children` = the form card | lg+: navy left panel (40%, min 560px) with inverse Logo, 34px headline, sample 3-column board; light grey right side, card centred. Below lg: panel hidden, Logo above the card | login, signup, invite | done |
| OnboardingLayout | layout | `components/layout/onboarding-layout.tsx` | — | — | onboarding wizard | todo |
| AppShell | layout | `components/layout/app-shell.tsx` | — | — | all signed-in screens | todo |
| AppSidebar (org switcher, nav, workspace tree, user menu) | layout | `components/layout/app-sidebar.tsx` | — | — | all signed-in screens | todo |
| TopNav (breadcrumb, New task, bell) | layout | `components/layout/top-nav.tsx` | — | — | all signed-in screens | todo |
| SettingsLayout | layout | `components/layout/settings-layout.tsx` | — | — | settings pages | todo |

## Screens

Build order follows the journey doc. Tick a screen when it ships.

| # | Screen | Route | Journey | Needs | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Create organisation | `/signup` | 1 | AuthLayout, Logo, Field, Input, PasswordInput, Button | todo |
| 2 | Verify email | `/verify-email` | 1 | AuthLayout, InputOTP, Button | todo |
| 3 | Onboarding: team / workspace / invite | `/onboarding/*` | 1 | OnboardingLayout, Stepper, Card, Input, Select, Button | todo |
| 4 | Log in | `/login` (`/{org}/login` todo) | 2 | AuthLayout, Logo, Card, FormTextField, FormPasswordField, FormCheckbox, FormErrorBanner, Field, Label, Input, PasswordInput, Checkbox, Button, TextLink, Separator, BoardColumn, TaskCard, IssueTypeIcon, UserAvatar | in progress (UI done; auth backend not wired) |
| 5 | Forgot / reset password | `/forgot-password`, `/reset-password/[token]` | 2 | AuthLayout, Field, Input, PasswordInput, Button | todo |
| 6 | Accept invite | `/invite/[token]` | 2 | AuthLayout, UserAvatar, Input, PasswordInput, Button | todo |
| 7 | App shell | `/{org}/layout` | 3 | AppShell, AppSidebar, TopNav, DropdownMenu, Breadcrumb, Command | todo |
| 8 | My Work | `/{org}/home` | 3 | StatTile, Tabs, TaskRow, StatusLozenge, PriorityIcon, EmptyState | todo |
| 9 | Workspaces list + create | `/{org}/workspaces` | 4 | Card, Dialog, Input, Textarea | todo |
| 10 | Workspace overview | `/{org}/w/[ws]` | 4 | ProjectCard, AvatarStack, Progress, Tabs | todo |
| 11 | Workspace members / settings | `/{org}/w/[ws]/members`, `/settings` | 4 | Table, Select, Dialog | todo |
| 12 | Project board | `/{org}/w/[ws]/p/[project]` | 5 | BoardColumn, TaskCard, FilterChip, Tabs | todo |
| 13 | Project list / calendar / timeline | `/{org}/w/[ws]/p/[project]/*` | 5 | Table, Calendar, TaskRow | todo |
| 14 | Create project | dialog | 5 | Dialog, Input, Textarea, Select, DatePicker | todo |
| 15 | Quick add task | dialog | 6 | Dialog, Input, Popover, Command, DatePicker | todo |
| 16 | Task drawer | `?task=` / `/{org}/t/[taskId]` | 6 | Sheet, StatusLozenge, Select, Checkbox, Textarea, Tabs | todo |
| 17 | Inbox | `/{org}/inbox` | 7 | NotificationItem, FilterChip, Tabs | todo |
| 18 | Settings: profile, preferences, notifications, security | `/{org}/settings/*` | 8 | SettingsLayout, Form, Input, Select, Checkbox, Avatar | todo |
| 19 | Org admin: members, security, billing, audit | `/{org}/settings/*` | 9 | SettingsLayout, Table, Select, Badge, Dialog | todo |

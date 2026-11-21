# Component inventory

Tracks which components each screen needs, so the library grows screen by screen.

- **Source of screens:** the Taskify user journey doc.
- **Source of styles:** the Taskify Design System. Its tokens are in `app/globals.css` and previewed at `/theme`.
- **Naming:** Organisation › Workspace › Project › Task.

## Where components live

| Folder | What goes there |
| --- | --- |
| `components/ui/` | Raw shadcn primitives (`npx shadcn@latest add <name>`), adjusted only to use our tokens |
| `components/common/` | Taskify composites built from primitives (StatusLozenge, UserAvatar, TaskCard…) |
| `components/layout/` | App shell pieces (AppSidebar, TopNav, AuthLayout…) |

Status: `todo` · `in progress` · `done`

## Library

| Component | Kind | Folder | Used on screens | Status |
| --- | --- | --- | --- | --- |
| Button | shadcn | ui | all | todo |
| Input | shadcn | ui | auth, onboarding, settings, dialogs | todo |
| Label | shadcn | ui | all forms | todo |
| PasswordInput | composite | common | signup, login, invite, reset, settings | todo |
| Select | shadcn | ui | onboarding, settings, task drawer | todo |
| Checkbox | shadcn | ui | task rows, subtasks, settings | todo |
| Textarea | shadcn | ui | create workspace/project, task description | todo |
| Form (react-hook-form + zod) | shadcn | ui | all forms | todo |
| InputOTP | shadcn | ui | verify email, 2FA | todo |
| Card | shadcn | ui | auth card, stat tiles, project cards | todo |
| Dialog | shadcn | ui | create workspace, create project, quick add task, confirms | todo |
| Sheet | shadcn | ui | task drawer, mobile sidebar | todo |
| DropdownMenu | shadcn | ui | org switcher, user menu, row actions | todo |
| Popover | shadcn | ui | date picker, assignee picker | todo |
| Command | shadcn | ui | Ctrl/⌘K palette, assignee/label pickers | todo |
| Calendar / DatePicker | shadcn | ui | due dates, calendar view | todo |
| Tabs | shadcn | ui | My Work, workspace, project views, task drawer | todo |
| Table | shadcn | ui | members, list view | todo |
| Badge | shadcn | ui | counts, labels | todo |
| Avatar | shadcn | ui | everywhere people appear | todo |
| Tooltip | shadcn | ui | icon buttons | todo |
| Progress | shadcn | ui | project cards, subtasks, onboarding | todo |
| Separator | shadcn | ui | menus, panels | todo |
| Skeleton | shadcn | ui | every loading state | todo |
| Sonner (toast) | shadcn | ui | undo, saved, errors | todo |
| Alert | shadcn | ui | section messages | todo |
| Sidebar | shadcn | ui | app shell | todo |
| Breadcrumb | shadcn | ui | top bar | todo |
| ScrollArea | shadcn | ui | board columns, drawer | todo |
| Logo | composite | common | auth, app shell | todo |
| StatusLozenge | composite | common | board, list, drawer, My Work | todo |
| PriorityIcon | composite | common | task rows, cards, drawer | todo |
| UserAvatar / AvatarStack | composite | common | task cards, workspace header, members | todo |
| StatTile | composite | common | My Work | todo |
| TaskRow | composite | common | My Work, list view | todo |
| TaskCard | composite | common | board | todo |
| ProjectCard | composite | common | workspace overview | todo |
| BoardColumn | composite | common | board | todo |
| EmptyState | composite | common | every list | todo |
| FilterChip | composite | common | board/list filters, inbox filters | todo |
| NotificationItem | composite | common | inbox | todo |
| Stepper | composite | common | onboarding wizard | todo |
| AuthLayout (brand panel + form card) | layout | layout | signup, login, invite | todo |
| OnboardingLayout | layout | layout | onboarding wizard | todo |
| AppShell | layout | layout | all signed-in screens | todo |
| AppSidebar (org switcher, nav, workspace tree, user menu) | layout | layout | all signed-in screens | todo |
| TopNav (breadcrumb, New task, bell) | layout | layout | all signed-in screens | todo |
| SettingsLayout | layout | layout | settings pages | todo |

## Screens

Build order follows the journey doc. Tick a screen when it ships.

| # | Screen | Route | Journey | Needs | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Create organisation | `/signup` | 1 | AuthLayout, Logo, Form, Input, PasswordInput, Button | todo |
| 2 | Verify email | `/verify-email` | 1 | AuthLayout, InputOTP, Button | todo |
| 3 | Onboarding: team / workspace / invite | `/onboarding/*` | 1 | OnboardingLayout, Stepper, Card, Input, Select, Button | todo |
| 4 | Log in | `/login`, `/{org}/login` | 2 | AuthLayout, Form, Input, PasswordInput, Button, Separator | todo |
| 5 | Forgot / reset password | `/forgot-password`, `/reset-password/[token]` | 2 | AuthLayout, Input, PasswordInput, Button | todo |
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

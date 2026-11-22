# Forgot password screen (`/forgot-password`) — Plan

Branch `screen/forgot-password` · Source design: "Forgot password — desktop.pdf"

## Context

The login form already links to `/forgot-password` ("Forgot password?"), but that page doesn't exist yet. It is screen #5 in `docs/component-inventory.md`. The design reuses the split auth layout with its own brand panel: a headline, a subline and 3 numbered steps. The card shows a lock icon badge, "Can't log in?", a single Email field, "Send recovery link", a divider and "‹ Back to log in".

The app is frontend only. Formik + Yup validate in the browser, and `onSubmit` stops at `// TODO: connect to backend`.

### Decisions (agreed with user)

| Topic | Decision |
| --- | --- |
| Scope | Only `/forgot-password`. `/reset-password/[token]` waits for its design, so screen #5 stays "in progress". |
| After a valid submit | The card swaps to a **"Check your email"** view (not in the PDF; designed from the existing card styles) |
| Step rows | **Extend `FeatureCard`** with a `step` number. No new StepList. |
| Lock / mail circle | **New `IconBadge`** |
| Brand panel | Use the existing per-route pattern: new `forgot-password/layout.tsx` → `AuthLayout` props (no AuthLayout change) |

## Reuse / Extend / New

| Element | Registry | Bucket |
| --- | --- | --- |
| Split page, panel headline + subline | AuthLayout | Reuse (props) |
| Logo (panel / mobile) | Logo | Reuse |
| Numbered steps 1–3 | FeatureCard | **Extend** (`step`) |
| White raised card | Card | Reuse |
| Lock icon in light-blue circle | — | **New** `IconBadge` |
| Title + description | CardTitle / CardDescription | Reuse |
| Email * | FormTextField + `emailRule` | Reuse |
| Form message, focus on error | FormErrorBanner, FocusFirstError | Reuse |
| Send recovery link | Button `size="lg"` | Reuse |
| Divider | Separator | Reuse |
| ‹ Back to log in | TextLink + lucide `ChevronLeft` | Reuse |

## Steps

### 0. Before writing code
Per `AGENTS.md`, re-read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` (nested layouts, metadata).

### 1. Extend `components/common/feature-card.tsx`
- Props become: `title`, `className?`, plus **either** `icon: LucideIcon` **or** `step: number`. `description?` becomes optional.
- `step`: a round marker (`size-8 rounded-full bg-surface text-brand-900 text-body-strong`, number centred) in place of the square icon tile.
- No description: the row is `items-center`, and the title is `text-title-sm font-medium text-on-brand` (matches the design's single line).
- Title element: `<h2>` when there is a description (as today, for signup), `<p>` when there isn't. A numbered list item shouldn't be a heading.
- Signup's usage is unchanged.

### 2. New `components/common/icon-badge.tsx`
- `icon: LucideIcon`, `className?`. `aria-hidden` (decorative; the heading carries the meaning).
- Looks like: `size-15` (60px) `rounded-full bg-brand-100`, centred `size-6 text-brand-600` icon.
- No size or tone variants until a screen needs them.

### 3. Route `app/(auth)/forgot-password/`
- **`layout.tsx`**: `AuthLayout` with headline "Locked out? You'll be back on your board shortly." and subline "Resetting your password takes three quick steps.". The panel is `<ol className="flex max-w-[460px] flex-col gap-3">` of 3 `<li><FeatureCard step={n} title=… /></li>`:
  1. Enter the email you use for Taskify
  2. Open the recovery link we email you
  3. Choose a new password and log in
- **`forgot-password-schema.ts`**: `forgotPasswordSchema = yup.object({ email: emailRule })`, `ForgotPasswordValues`, `forgotPasswordInitialValues = { email: "" }`. `emailRule` comes from `lib/validation/rules.ts` and isn't copied.
- **`forgot-password-form.tsx`** (`"use client"`, `ForgotPasswordForm`). It renders the card's **inner content** (header + content), because the header changes between the two views:
  - State: `sentTo: string | null`.
  - **Request view** (`sentTo === null`): centred `CardHeader` with `IconBadge icon={Lock}`, `h1.text-heading-1` "Can't log in?", description "Enter your account email and we'll send you a link to reset your password.". Below it, `<Formik>` with `initialValues`, `validationSchema` and `<Form noValidate>` containing `FocusFirstError` and a `FieldGroup gap-5`: `FormTextField name="email" label="Email" type="email" autoComplete="email" placeholder="you@company.com" required`, then `FormErrorBanner`, then a submit `Button size="lg" w-full` "Send recovery link" / "Sending…".
    - `onSubmit`: `setStatus(undefined)`, `// TODO: connect to backend`, `setSentTo(values.email)`.
    - When returning from the sent view, Formik gets `initialValues={{ email: sentTo ?? "" }}` (kept in a separate `lastEmail` state), so the typed email is kept.
  - **Sent view**: `IconBadge icon={MailCheck}`, `h1` "Check your email" (`tabIndex={-1}`, focused on mount so screen readers announce the change). Description: "If an account exists for **{email}**, we've sent a link to reset your password." This wording doesn't reveal whether the account exists.
    - Then a `Button variant="outline" size="lg" w-full` "Resend link". Its onClick is `// TODO: connect to backend`, then a `role="status"` line in `text-small text-ink-muted`: "Link sent again."
    - Then a `Button variant="link"` "Use a different email", which goes back to the request view with the email prefilled.
- **`page.tsx`** (server component): `metadata.title = "Forgot password"`. Card uses the same classes as login and signup (`w-full max-w-[434px] gap-6 px-6 py-8 shadow-raised sm:px-10`). It contains `<ForgotPasswordForm />`, then a `CardFooter flex-col gap-4 px-0` with `<Separator />` and `<TextLink href="/login" className="gap-1"><ChevronLeft aria-hidden /> Back to log in</TextLink>`. That footer is the same in both views.

### 4. Gallery — `app/(dev)/components/page.tsx`
- Add an `icon-badge` entry to the Common nav list. Add a Showcase with `Lock` and `MailCheck`.
- FeatureCard Showcase: add a "numbered steps (forgot password)" demo with 3 `step` cards in an `<ol>` on brand-900. Keep the existing icon demos.
- AuthLayout Showcase text: add the numbered FeatureCards on `/forgot-password`.

### 5. Docs (same change)
- `docs/component-inventory.md`:
  - New **IconBadge** row (composite, path, `icon`, looks like, used on forgot-password, done).
  - **FeatureCard**: props (`icon` or `step`, optional `description`), looks like (round white number marker variant), used on forgot-password panel.
  - Add forgot-password to "Used on screens" for AuthLayout, Card, FormTextField, FormErrorBanner, Button, Separator, TextLink, Logo.
  - Screen #5: Needs = AuthLayout, Logo, FeatureCard, Card, IconBadge, FormTextField, FormErrorBanner, Field, Label, Input, Button, Separator, TextLink. Status "in progress (forgot-password UI done; reset-password todo; backend not wired)".
- `.claude/plan/Taskify-forms-formik-yup.md`:
  - Folder conventions: add `app/(auth)/forgot-password/` (layout, page, form, schema).
  - Add a short "Form that swaps to a success view" pattern: local `sentTo` state, `onSubmit` ends at the TODO then shows the confirmation, and initial values are kept for "use a different email".
- `.claude/plan/Taskify-forgot-password.md`: a copy of this plan, matching `Taskify-user-register.md`.

## Not in scope
- `/reset-password/[token]`, backend calls, resend rate limiting/cooldown, and a test runner.

## Verification
1. `npx tsc --noEmit`, `npm run lint` and `npm run build` pass.
2. `npm run dev`:
   - `/forgot-password` at desktop width matches the PDF: panel headline, 3 numbered rows, card with lock badge, field, button, divider, back link. Below `lg` the panel hides and the Logo sits above the card.
   - `/login` "Forgot password?" goes here, and "Back to log in" returns to `/login`.
   - `/signup` panel FeatureCards look unchanged.
   - Empty submit → "Enter your email address.", focus on Email. `abc` → the invalid-email message.
   - Valid email → "Check your email" view with the email in bold, and focus on the heading. "Resend link" shows "Link sent again.". "Use a different email" → form with the email prefilled.
   - Keyboard only: tab order matches the visual order.
3. `/components` shows IconBadge (both icons) and the FeatureCard step variant.

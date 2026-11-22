# User registration screen (`/signup`) — Plan

2026-11-22 · Branch `screen/user-register` · Source design: "Register — desktop.pdf"

> Status: **approved** 2026-11-22.

## Context

Login links to `/signup` ("Create an account"), but the page doesn't exist yet. It is screen #1 in `docs/component-inventory.md` ("Create organisation", `/signup`). The design is a split auth screen like login, but with a **different brand panel** (headline + 3 feature cards instead of the sample board) and a sign-up card: full name, work email, password with a strength meter, organisation name with a live URL preview, a terms checkbox, Create account, "or", Sign up with SSO, and a Log in link.

As with login, this is frontend only: Formik + Yup in the browser, and `onSubmit` stops at `// TODO: connect to backend`.

### Decisions (agreed)

| Topic | Decision |
| --- | --- |
| Route | `/signup` → `app/(auth)/signup/` (login already links here; matches the registry) |
| "Workspace name" field | Becomes **Organisation name** (`organisationName`), URL preview `taskify.app/{org-slug}`. Matches Organisation › Workspace › Project › Task |
| Subtitle | "Free for teams up to 10 users." |
| Per-screen brand panel | `AuthLayout` takes the panel content as props. `app/(auth)/layout.tsx` is replaced by `login/layout.tsx` and `signup/layout.tsx` |
| Password rule | Hint says "letters, numbers and a symbol", so `newPasswordRule` must enforce all three (today it only checks length + number) |

## Screen breakdown: Reuse / Extend / New

| Element on screen | Registry component | Bucket | What changes |
| --- | --- | --- | --- |
| Split page, navy left panel, grey right side | AuthLayout | **Extend** | New props for headline, subline and panel body, so each screen picks its panel |
| Logo (inverse on panel, default on mobile) | Logo | Reuse | — |
| "Set up your team's workspace in minutes." + subline | AuthLayout (headline/subline) | Extend | Part of the AuthLayout change above |
| 3 feature cards (icon tile, title, description) | — | **New** | `FeatureCard`: brand-800 box, white icon tile, white title, muted description |
| Login's sample board | AuthLayout (BoardColumn, TaskCard) | Reuse | Moves out of AuthLayout into the login panel, unchanged |
| White card, title "Create your account", subtitle | Card | Reuse | Same classes as login card |
| Full name / Work email inputs | FormTextField | Reuse | — |
| Password with Show toggle | FormPasswordField | Reuse | — |
| 4-segment strength bar | — | **New** | `PasswordStrengthMeter`: 4 grey segments that fill and change colour |
| "Use 8+ characters…" hint under password | FormPasswordField | **Extend** | New `description` prop (uses `FieldDescription`) and `showStrength` prop |
| Organisation name + "Your URL: **taskify.app/acme**" | FormTextField | **Extend** | Same `description` prop; the form passes the live slug |
| Terms checkbox with links, error when unticked | FormCheckbox | **Extend** | `label` accepts links (`ReactNode`); shows a red error, `aria-invalid`, `aria-describedby`; checkbox top-aligned for a 2-line label |
| Terms of service / Privacy policy / Log in links | TextLink | Reuse | — |
| Create account button | Button `size="lg"` | Reuse | — |
| "or" divider | FieldSeparator | Reuse | — |
| Sign up with SSO (key icon) | Button `variant="outline"` + `asChild` Link | Reuse | Links to `/signup/sso` (placeholder, like `/login/sso`) |
| Form-level message + focus first error | FormErrorBanner, FocusFirstError | Reuse | — |

Checked `components/ui`, `components/common`, `components/layout`: nothing in code already does the feature card or the strength meter.

## Files

### 0. Before writing code
- Read the Next.js layout docs in `node_modules/next/dist/docs/` (nested `layout.tsx`, metadata) before writing route files, per `AGENTS.md`.

### 1. Validation — `lib/validation/rules.ts` (edit)
- Export the regexes used by both the rule and the meter: `HAS_LETTER = /[A-Za-z]/`, `HAS_NUMBER = /[0-9]/`, `HAS_SYMBOL = /[^A-Za-z0-9]/`.
- `newPasswordRule`: keep `required` + `min(8)`, add `.matches(HAS_LETTER, "Include at least one letter.")`, `HAS_NUMBER` (existing message), `.matches(HAS_SYMBOL, "Include at least one symbol.")`.
- New `organisationNameRule`: trim, required "Enter your organisation name.", max 50, and a `.test` that the slug isn't empty ("Use at least one letter or number."). Will be reused by organisation settings.
- New `acceptTermsRule`: `yup.boolean().oneOf([true], "Agree to the Terms of service and Privacy policy to continue.").required()`. Will be reused by Accept invite.

### 2. Helpers (new)
- `lib/slug.ts` → `toSlug(name)`: lowercase, non-alphanumerics → `-`, collapse/trim dashes, cap at 48 chars.
- `lib/validation/password-strength.ts` → `getPasswordStrength(pw): 0–4` = count of {8+ chars, letter, number, symbol}, using the regexes from `rules.ts`.

### 3. Form inputs (extend)
- `hooks/use-form-field-props.ts`: accept `{ hasDescription }`; `aria-describedby` lists `${name}-description` and, when shown, `${name}-error`.
- `components/common/form-text-field.tsx`:
  - Both fields get `description?: ReactNode`, rendered as `<FieldDescription id="{name}-description">` under the input and above the error.
  - `FormPasswordField` gets `showStrength?: boolean`: renders `PasswordStrengthMeter` (reading the field value) between the input and the description.
- `components/common/form-checkbox.tsx`: `label: ReactNode`; read `meta` from `useField`, show `<FieldError id="{name}-error">` once touched; set `aria-invalid` / `aria-describedby` on the Checkbox (so `FocusFirstError` finds it); `items-start` + small top margin on the box for wrapped labels.

### 4. New components
- `components/common/password-strength-meter.tsx` — `value: string`. 4 segments (h-1, gap, rounded, `bg-border` when empty). Filled colour by score: 1 `bg-danger`, 2 `bg-warning-text`, 3–4 `bg-success`. Visually hidden live text ("Password strength: weak / fair / good / strong") for screen readers; bars `aria-hidden`.
  - Note: there's no solid amber token, so "fair" uses `--warning-text` (#7F5F01). Can add a `--warning` token later if the design system has one.
- `components/common/feature-card.tsx` — `icon: LucideIcon`, `title`, `description`. `bg-brand-800`, 6px radius, p-4, row with a 36px white rounded icon tile (`text-brand-900`), title `text-body` semibold `text-on-brand`, description `text-body text-on-brand-muted`.

### 5. Layout (extend AuthLayout)
- `components/layout/auth-layout.tsx`: `AuthLayout({ headline, subline, panel, children })`. Brand panel keeps its shell (navy bg, inverse Logo, padding, `lg:flex`), renders headline/subline, then `panel`. Move the sample board out as exported `AuthBoardPreview` (same file, unchanged markup).
- Delete `app/(auth)/layout.tsx`. Add:
  - `app/(auth)/login/layout.tsx` → `AuthLayout` with today's headline/subline and `<AuthBoardPreview />` (login must look identical).
  - `app/(auth)/signup/layout.tsx` → headline "Set up your team's workspace in minutes.", subline "Create a project, invite your team and start your first sprint.", panel = 3 `FeatureCard`s (Boards and backlogs / `SquareKanban`; Sprints and reports / `ChartLine`; Built for teams / `Users`), copy from the design.

### 6. Screen — `app/(auth)/signup/`
- `signup-schema.ts` → `signupSchema = { fullName: nameRule.required("Enter your full name."), email: emailRule.required("Enter your work email."), password: newPasswordRule, organisationName: organisationNameRule, acceptTerms: acceptTermsRule }`, `SignupValues`, `signupInitialValues` (all `""`, `acceptTerms: false`).
- `signup-form.tsx` (`"use client"`, `SignupForm`), same shape as `login-form.tsx`:
  - `FocusFirstError`, `FieldGroup gap-5`: Full name (`autoComplete="name"`), Work email (`type="email"`, `autoComplete="email"`), Password (`autoComplete="new-password"`, `showStrength`, description "Use 8+ characters with letters, numbers and a symbol."), Organisation name (placeholder "e.g. Acme Engineering", `autoComplete="organization"`, description "Your URL: **taskify.app/{toSlug(values.organisationName) || "your-organisation"}**"), terms `FormCheckbox` with `TextLink`s to `/terms` and `/privacy`, `FormErrorBanner`, submit "Create account" / "Creating account…".
  - `onSubmit`: clear status, `// TODO: connect to backend`, then `setStatus({ formError: "Sign-up isn't connected to a backend yet." })`.
  - Below the form: `FieldSeparator` "or", outline SSO button.
- `page.tsx` (server component): `metadata.title = "Create your account"`; Card like login (`max-w-[434px] gap-6 px-6 py-8 shadow-raised sm:px-10`), `h1` "Create your account", description "Free for teams up to 10 users.", `<SignupForm />`, then "Already have an account? Log in" (`TextLink href="/login"`). No legal footer (not in the design).

### 7. Gallery — `app/(dev)/components/page.tsx` (+ `form-demos.tsx` if needed)
- `FeatureCard` on a brand-900 swatch.
- `PasswordStrengthMeter` at scores 0–4.
- `FormTextField` with description; `FormPasswordField` with `showStrength` + description (empty and typed).
- `FormCheckbox` with a link label: unchecked, checked, touched-with-error, disabled.
- AuthLayout: note the new props.

### 8. Docs (same change)
- `docs/component-inventory.md`:
  - New rows: FeatureCard, PasswordStrengthMeter (Status done, path, props, Looks like).
  - Update: AuthLayout (path: used by `login/layout.tsx`, `signup/layout.tsx`; new props; Looks like mentions panel per screen), FormTextField / FormPasswordField (`description`, `showStrength`), FormCheckbox (`ReactNode` label, error state), "Used on screens" adds signup for every reused component.
  - Screen #1: "Create organisation (sign up)", `/signup`, full Needs list, status "in progress (UI done; backend not wired)".
- `.claude/plan/Taskify-forms-formik-yup.md` (code and plan must agree):
  - `newPasswordRule` code (letter + symbol), add `organisationNameRule`, `acceptTermsRule`.
  - Replace the `sign-up/sign-up-schema.ts` example (with confirmPassword) by the real `signup/signup-schema.ts`.
  - Update the `useFormFieldProps`, `FormTextField`/`FormPasswordField` and `FormCheckbox` snippets and the Form inputs table.
  - Folder conventions: replace `app/(auth)/layout.tsx` assumptions; add `signup/`.

## Not in scope
- Backend calls, org-URL availability check (needs backend), `/signup/sso`, `/terms`, `/privacy` pages, email verification (screen #2).
- Test runner (still an open rollout step in the forms plan).

## Verification
1. `npx tsc --noEmit` and `npm run lint` pass; `npm run build` succeeds.
2. `npm run dev`:
   - `/signup` at desktop width matches the PDF (panel, card, spacing); below `lg` the panel hides and the Logo sits above the card.
   - `/login` looks exactly as before (board preview panel).
   - Empty submit: errors on all 5 fields, focus moves to Full name, nothing reaches `onSubmit`.
   - Password `abc` → 1 segment red; `abcdefg1` → 3; `abcdefg1!` → 4 green; error messages match each missing rule.
   - Organisation "Acme Engineering!" → "taskify.app/acme-engineering"; "!!!" → slug error.
   - Untick terms after submit → red error under the checkbox; tick → clears.
   - Valid form → banner "Sign-up isn't connected to a backend yet."; button shows "Creating account…" while submitting.
   - Keyboard only: Tab order matches visual order, Show/Hide doesn't submit, links inside the checkbox label are reachable.
3. `/components` shows every new variant and state.

# Forms with Formik + Yup — Tech Plan

2026-11-22 · Source: https://claude.ai/artifact/KE4deLEtHA9KDNFB8kvvPC

## Overview

All Taskify forms will use **Formik** for form state and **Yup** for validation rules, replacing the current `useActionState` + zod setup on the login screen.

This is a **frontend-only app** (see `AGENTS.md`, "No server code in this app"). A separate backend already exists. So forms validate in the browser and `onSubmit` ends at `// TODO: connect to backend`. No server actions, no route handlers. The backend is connected later, only when the user asks.

| | Today (login screen) | Target |
| --- | --- | --- |
| Form state | Uncontrolled inputs + `useActionState` | Formik (`<Formik>`, `useField`) |
| Validation | zod, in a server action, on submit | Yup schema, in the browser, on change/blur/submit |
| When errors show | Only after submit | Once a field is touched, or on submit |
| Submit | `<form action={serverAction}>` | `onSubmit(values)` → `// TODO: connect to backend` |

**Goals**

- Instant, field-level feedback.
- Reusable validation rules (one `emailRule`, used by every form with an email field).
- A small set of Formik-aware inputs, so screens never wire `aria-*` and error props by hand.

**Out of scope:** connecting to the backend, and multi-step wizards.

## Installation and setup

Install both packages; both ship their own TypeScript types.

```bash
npm install formik yup
```

### Folder conventions

Each form lives **in the route folder of the screen that uses it**, together with its Yup schema. Only things shared by several forms live outside the route.

```
lib/validation/
  rules.ts                     ← reusable field rules: emailRule, passwordRule, newPasswordRule …
  password-strength.ts         ← getPasswordStrength (0–4), same checks as newPasswordRule

hooks/
  use-form-field-props.ts      ← shared hook used by the form inputs below

components/common/
  form-text-field.tsx          ← FormTextField + FormPasswordField
  form-checkbox.tsx            ← FormCheckbox
  form-error-banner.tsx        ← FormErrorBanner + FocusFirstError

app/(auth)/login/
  layout.tsx                   ← AuthLayout with this screen's brand panel (each auth route has its own)
  page.tsx                     ← the route (server component, renders <LoginForm />)
  login-form.tsx               ← the login form: <Formik>, initial values, onSubmit
  login-schema.ts              ← loginSchema, LoginValues, loginInitialValues (built from rules.ts)

app/(auth)/signup/             ← same pattern: layout.tsx, page.tsx, signup-form.tsx, signup-schema.ts

app/(auth)/reset-password/     ← same pattern for every other screen with a form
  page.tsx
  reset-password-form.tsx
  reset-password-schema.ts
```

| Term | Meaning | Where |
| --- | --- | --- |
| **Form inputs** (Formik-aware inputs) | Our design-system `Field` + `Input` / `PasswordInput` / `Checkbox`, wrapped so they read their value, error and touched state from Formik by `name`. Shared by every form, like `Button`. | `components/common/form-*.tsx` |
| **Screen form** | The form for one screen, e.g. the login form. Owns `<Formik>`, the initial values and `onSubmit`, and lays out the form inputs. | Route folder, `<screen>-form.tsx` |
| **Screen schema** | The Yup object for one screen's form. Composes reusable rules. | Route folder, `<screen>-schema.ts` |
| **Validation rules** | One Yup rule per kind of field (email, password, title…), reused across schemas. | `lib/validation/rules.ts` |

Files in a route folder other than `page.tsx`, `layout.tsx` etc. are **not routable**, so colocating `login-form.tsx` and `login-schema.ts` is safe (Next.js docs: `01-app/01-getting-started/02-project-structure.md`, "Colocation").

A schema moves out of the route folder only when a second screen needs the **whole** schema; then it goes to `lib/validation/<area>.ts`.

Formik uses React state and context, so **every file that renders `<Formik>` or calls `useField` must start with `"use client"`**. `page.tsx` stays a server component and just renders the client form.

Once every form is migrated, remove `zod` from `package.json`.

## Core concepts

Yup describes **what valid data looks like**; Formik tracks **what the user has typed and touched** and asks Yup whether it is valid.

### Yup in 30 seconds

A schema is a chain of rules. Each rule takes the message shown to the user.

```ts
import * as yup from "yup";

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Enter your email address.")
    .email("Enter a valid email address, like you@company.com."),
  password: yup.string().required("Enter your password."),
});

// TypeScript type derived from the schema, so types and rules never drift apart
type Values = yup.InferType<typeof schema>;
// => { email: string; password: string }
```

### Formik in 30 seconds

Formik keeps this state for the whole form:

| Piece | Meaning |
| --- | --- |
| `values` | Current value of every field, e.g. `{ email: "a@b", password: "" }` |
| `errors` | Message per invalid field, produced by the Yup schema |
| `touched` | Which fields the user has left (blurred). Formik marks **all** fields touched on submit |
| `isSubmitting` | `true` while `onSubmit` runs, used to disable the button |
| `status` | Free-form slot; we use it for form-level messages (`{ formError }`) |
| `submitCount` | How many times submit was attempted |

### How one submit flows

1. User types → Formik updates `values` and (by default) re-runs the schema on change.
2. User leaves a field → it is marked `touched`; its error now becomes visible.
3. User clicks submit → Formik marks every field touched and validates. If anything fails, `onSubmit` is **not** called and errors show.
4. If valid → `onSubmit(values, helpers)` runs. For now it ends at `// TODO: connect to backend`.

**Rule of thumb for showing an error:** `touched.field && errors.field`. Without the `touched` check, users see “Enter your email” before they have typed anything.

## Reusable validation rules

Each kind of field gets **one** rule in `lib/validation/rules.ts`. Screen schemas compose these, so a change to the email message or format applies to every form at once.

```ts
// lib/validation/rules.ts
import * as yup from "yup";

export const emailRule = yup
  .string()
  .trim()
  .required("Enter your email address.")
  .email("Enter a valid email address, like you@company.com.");

/** Signing in: any non-empty password. */
export const passwordRule = yup.string().required("Enter your password.");

/** Character checks shared by `newPasswordRule` and the password strength meter. */
export const HAS_LETTER = /[A-Za-z]/;
export const HAS_NUMBER = /[0-9]/;
export const HAS_SYMBOL = /[^A-Za-z0-9]/;
export const MIN_PASSWORD_LENGTH = 8;

/** Creating or resetting a password: 8+ characters with letters, numbers and a symbol. */
export const newPasswordRule = yup
  .string()
  .required("Enter a password.")
  .min(MIN_PASSWORD_LENGTH, "Use at least 8 characters.")
  .matches(HAS_LETTER, "Include at least one letter.")
  .matches(HAS_NUMBER, "Include at least one number.")
  .matches(HAS_SYMBOL, "Include at least one symbol.");

/** Confirm field that must match another field (default: "password"). */
export const confirmPasswordRule = (field = "password") =>
  yup
    .string()
    .required("Confirm your password.")
    .oneOf([yup.ref(field)], "Passwords don’t match.");

export const nameRule = yup
  .string()
  .trim()
  .required("Enter your name.")
  .max(100, "Keep it under 100 characters.");

/** Organisation name; its slug (`toSlug` in lib/slug.ts) becomes the URL taskify.app/{slug}. */
export const organisationNameRule = yup
  .string()
  .trim()
  .required("Enter your organisation name.")
  .max(50, "Keep it under 50 characters.")
  .test("has-slug", "Use at least one letter or number.", (value) => !value || toSlug(value) !== "");

/** Must be ticked. A .test (not .oneOf([true])) keeps the inferred type `boolean`, so initial values can be `false`. */
export const acceptTermsRule = yup
  .boolean()
  .required()
  .test("accepted", "Agree to the Terms of service and Privacy policy to continue.", (value) => value === true);
```

Need a different message on one screen? Chain an override; the shared rule is not changed:

```ts
email: emailRule.required("Enter your work email."),
```

Composing them, e.g. login and sign-up share `emailRule`:

```ts
// app/(auth)/login/login-schema.ts
export const loginSchema = yup.object({
  email: emailRule,
  password: passwordRule,
  remember: yup.boolean().default(false),
});

// app/(auth)/signup/signup-schema.ts
export const signupSchema = yup.object({
  fullName: nameRule.required("Enter your full name."),
  email: emailRule.required("Enter your work email."),
  password: newPasswordRule,
  organisationName: organisationNameRule,
  acceptTerms: acceptTermsRule,
});
```

## Form inputs (Formik-aware)

Five small pieces; every screen form uses them instead of wiring `useField`, `aria-*` and `FieldError` by hand. They are **Extend** entries in the component registry (same `Field` / `Input` / `Checkbox`, now reading from Formik).

| Piece | Wraps | Job |
| --- | --- | --- |
| `FormTextField` | `Field` + `FieldLabel` + `Input` + `FieldDescription` + `FieldError` | Text, email, number inputs; optional `description` hint |
| `FormPasswordField` | Same, with `PasswordInput` (+ `PasswordStrengthMeter` with `showStrength`) | Password with Show/Hide; strength meter for new passwords |
| `FormCheckbox` | `Field` + Radix `Checkbox` + `FieldError` | Booleans (Radix uses `onCheckedChange`, not `onChange`); `label` may contain links; shows an error once touched |
| `FormErrorBanner` | The warning `<p role="alert">` | Shows `status.formError` |
| `FocusFirstError` | Nothing visible | Moves focus to the first invalid field after a failed submit |

### Shared hook: `useFormFieldProps`

One place that turns Formik state into input props and accessibility attributes.

```tsx
// hooks/use-form-field-props.ts
"use client";

import { useField } from "formik";

type Options = {
  /** The field renders a description (hint) with id `${name}-description` */
  hasDescription?: boolean;
};

export function useFormFieldProps(name: string, { hasDescription = false }: Options = {}) {
  const [field, meta] = useField<string>(name);
  // Only show an error once the user has left the field (or submitted)
  const error = meta.touched ? meta.error : undefined;
  const errorId = `${name}-error`;
  const descriptionId = `${name}-description`;
  const describedBy = [hasDescription && descriptionId, error && errorId].filter(Boolean).join(" ");

  return {
    error,
    errorId,
    descriptionId,
    inputProps: {
      ...field, // name, value, onChange, onBlur
      id: name,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy || undefined,
    },
  };
}
```

### `FormTextField` and `FormPasswordField`

`description` renders a hint under the input (linked with `aria-describedby`); `showStrength` adds the `PasswordStrengthMeter`.

```tsx
// components/common/form-text-field.tsx
"use client";

import type { ComponentProps, ReactNode } from "react";

import { PasswordInput } from "@/components/common/password-input";
import { PasswordStrengthMeter } from "@/components/common/password-strength-meter";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormFieldProps } from "@/hooks/use-form-field-props";

type BaseProps = {
  /** Formik field name; also used as the input `id` */
  name: string;
  label: string;
  required?: boolean;
  /** Extra content on the label row, e.g. a "Forgot password?" link */
  labelAside?: ReactNode;
  /** Hint under the input, e.g. password rules or a URL preview; linked with `aria-describedby` */
  description?: ReactNode;
};

function LabelRow({ name, label, required, labelAside }: Omit<BaseProps, "description">) {
  return (
    <div className="flex items-center justify-between">
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      {labelAside}
    </div>
  );
}

type FormTextFieldProps = BaseProps &
  Omit<ComponentProps<typeof Input>, "name" | "id" | "value" | "onChange" | "onBlur">;

/** Label + Input + optional hint + error, wired to Formik by `name`. Render inside <Formik>. */
export function FormTextField({ name, label, required, labelAside, description, ...rest }: FormTextFieldProps) {
  const { error, errorId, descriptionId, inputProps } = useFormFieldProps(name, {
    hasDescription: !!description,
  });
  return (
    <Field data-invalid={!!error || undefined}>
      <LabelRow name={name} label={label} required={required} labelAside={labelAside} />
      <Input {...rest} {...inputProps} aria-required={required || undefined} />
      {description && (
        <FieldDescription id={descriptionId} className="m-0 text-ink-muted">
          {description}
        </FieldDescription>
      )}
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}

type FormPasswordFieldProps = BaseProps &
  Omit<ComponentProps<typeof PasswordInput>, "name" | "id" | "value" | "onChange" | "onBlur"> & {
    /** Show the 4-segment strength meter under the input (for new passwords) */
    showStrength?: boolean;
  };

/** Label + PasswordInput (Show/Hide) + optional strength meter and hint + error, wired to Formik. */
export function FormPasswordField({
  name,
  label,
  required,
  labelAside,
  description,
  showStrength,
  ...rest
}: FormPasswordFieldProps) {
  const { error, errorId, descriptionId, inputProps } = useFormFieldProps(name, {
    hasDescription: !!description,
  });
  return (
    <Field data-invalid={!!error || undefined}>
      <LabelRow name={name} label={label} required={required} labelAside={labelAside} />
      <PasswordInput {...rest} {...inputProps} aria-required={required || undefined} />
      {showStrength && <PasswordStrengthMeter value={inputProps.value ?? ""} />}
      {description && (
        <FieldDescription id={descriptionId} className="m-0 text-ink-muted">
          {description}
        </FieldDescription>
      )}
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}
```

### `FormCheckbox`

Radix `Checkbox` is a `<button>`, not an `<input>`, so Formik's `onChange` does not fit. We set the value through `helpers.setValue`. The label may contain links (e.g. Terms / Privacy), and a schema error (e.g. `acceptTermsRule`) shows once touched.

```tsx
// components/common/form-checkbox.tsx
"use client";

import type { ReactNode } from "react";
import { useField } from "formik";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type FormCheckboxProps = {
  /** Formik field name (boolean value); also used as the checkbox `id` */
  name: string;
  /** Text or inline content, e.g. "I agree to the <TextLink>Terms</TextLink>" */
  label: ReactNode;
  disabled?: boolean;
};

/**
 * Checkbox + label wired to a boolean Formik field, with an error once touched
 * (e.g. a must-accept terms box). Render inside <Formik>.
 * Radix Checkbox is a <button>, so the value is set with `helpers.setValue`, not `onChange`.
 */
export function FormCheckbox({ name, label, disabled }: FormCheckboxProps) {
  const [field, meta, helpers] = useField<boolean>(name);
  const error = meta.touched ? meta.error : undefined;
  const errorId = `${name}-error`;

  return (
    <Field data-invalid={!!error || undefined} data-disabled={disabled || undefined} className="gap-1.5">
      <div className="flex items-start gap-3">
        <Checkbox
          id={name}
          checked={field.value}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onCheckedChange={(checked) => helpers.setValue(checked === true)}
          onBlur={() => helpers.setTouched(true)}
          className="mt-0.5"
        />
        <FieldLabel htmlFor={name} className="block text-body font-normal text-ink">
          {label}
        </FieldLabel>
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}
```

### `FormErrorBanner` and `FocusFirstError`

```tsx
// components/common/form-error-banner.tsx
"use client";

import { useEffect } from "react";
import { useFormikContext } from "formik";

export type FormStatus = { formError?: string } | undefined;

export function FormErrorBanner() {
  const { status } = useFormikContext<unknown>();
  const message = (status as FormStatus)?.formError;
  if (!message) return null;
  return (
    <p role="alert" className="rounded-md bg-warning-bg px-3 py-2 text-small text-warning-text">
      {message}
    </p>
  );
}

/** Render inside <Form>. After a failed submit, focuses the first invalid field in DOM order. */
export function FocusFirstError() {
  const { isSubmitting, submitCount, isValid } = useFormikContext<unknown>();
  useEffect(() => {
    if (isSubmitting || submitCount === 0 || isValid) return;
    document.querySelector<HTMLElement>("form [aria-invalid='true']")?.focus();
  }, [isSubmitting, submitCount, isValid]);
  return null;
}
```

## Worked example: the login form

The same screen as today, in two files inside `app/(auth)/login/`. The server action `actions.ts` is deleted.

### 1. Screen schema

```ts
// app/(auth)/login/login-schema.ts
import * as yup from "yup";

import { emailRule, passwordRule } from "@/lib/validation/rules";

export const loginSchema = yup.object({
  email: emailRule,
  password: passwordRule,
  remember: yup.boolean().default(false),
});

export type LoginValues = yup.InferType<typeof loginSchema>;

export const loginInitialValues: LoginValues = {
  email: "",
  password: "",
  remember: false,
};
```

### 2. Screen form

```tsx
// app/(auth)/login/login-form.tsx
"use client";

import Link from "next/link";
import { Form, Formik } from "formik";
import { KeyRound } from "lucide-react";

import { FormCheckbox } from "@/components/common/form-checkbox";
import { FocusFirstError, FormErrorBanner } from "@/components/common/form-error-banner";
import { FormPasswordField, FormTextField } from "@/components/common/form-text-field";
import { TextLink } from "@/components/common/text-link";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";

import { loginInitialValues, loginSchema, type LoginValues } from "./login-schema";

export function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <Formik<LoginValues>
        initialValues={loginInitialValues}
        validationSchema={loginSchema}
        onSubmit={async (values, { setStatus }) => {
          setStatus(undefined); // clear the previous form-level message
          // `values` is valid here: Yup already ran.
          // TODO: connect to backend
          setStatus({ formError: "Sign-in isn’t connected to a backend yet." });
        }}
      >
        {({ isSubmitting }) => (
          // noValidate: Yup shows errors in our style instead of browser popups
          <Form noValidate>
            <FocusFirstError />
            <FieldGroup className="gap-5">
              <FormTextField
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
              />
              <FormPasswordField
                name="password"
                label="Password"
                autoComplete="current-password"
                placeholder="Enter password"
                required
                labelAside={
                  <TextLink href="/forgot-password" className="text-label">
                    Forgot password?
                  </TextLink>
                }
              />
              <FormCheckbox name="remember" label="Remember me" />
              <FormErrorBanner />
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in…" : "Log in"}
              </Button>
            </FieldGroup>
          </Form>
        )}
      </Formik>

      <FieldSeparator>or</FieldSeparator>

      <Button variant="outline" size="lg" className="w-full" asChild>
        <Link href="/login/sso">
          <KeyRound aria-hidden="true" />
          Continue with SSO
        </Link>
      </Button>
    </div>
  );
}
```

What this fixes compared with today: email **and** “Remember me” keep their values after a failed submit, errors clear as soon as the user corrects a field, and focus jumps to the first invalid field.

## Later: connecting to the backend (not now)

Do this only when the user asks for it. `onSubmit` will call the backend API and map its response onto Formik:

| Backend says | Formik helper | Shows as |
| --- | --- | --- |
| A specific field is wrong (“Email already in use”) | `setErrors({ email: "…" })` | Red text under that field |
| Something about the whole form (“Wrong email or password”) | `setStatus({ formError: "…" })` | `FormErrorBanner` |
| Unexpected failure (network, 500) | `setStatus({ formError: "Something went wrong. Try again." })` | `FormErrorBanner` |
| Success | Navigate (`router.push`), or `resetForm()` for forms that stay on screen | Navigation or a cleared form |

Browser validation is for user experience only; the backend must validate again.

## More patterns

Recipes for upcoming screens (sign-up, reset password, create task, invite members), in Yup 1.x syntax. Each schema lives in its screen's route folder and reuses `lib/validation/rules.ts`.

### Confirm password (compare two fields)

```ts
// app/(auth)/reset-password/reset-password-schema.ts
export const resetPasswordSchema = yup.object({
  password: newPasswordRule,
  confirmPassword: confirmPasswordRule(),
});
```

### Conditional field (required only sometimes)

Create-task form: “Due date” is required only for bugs.

```ts
// <create-task route folder>/create-task-schema.ts
export const createTaskSchema = yup.object({
  title: yup.string().trim().required("Add a title.").max(200, "Keep it under 200 characters."),
  type: yup.mixed<"task" | "bug" | "story">().oneOf(["task", "bug", "story"]).required(),
  dueDate: yup.date().when("type", {
    is: "bug",
    then: (s) => s.required("Bugs need a due date."),
    otherwise: (s) => s.notRequired(),
  }),
});
```

### Lists of inputs (invite several members)

```ts
// <invite route folder>/invite-schema.ts
export const inviteSchema = yup.object({
  emails: yup.array().of(emailRule).min(1, "Add at least one email."),
});
```

```tsx
import { FieldArray, useFormikContext } from "formik";

function InviteEmails() {
  const { values } = useFormikContext<{ emails: string[] }>();
  return (
    <FieldArray name="emails">
      {({ push, remove }) => (
        <>
          {values.emails.map((_, i) => (
            <div key={i} className="flex items-end gap-2">
              <FormTextField name={`emails.${i}`} label={`Email ${i + 1}`} type="email" />
              <Button type="button" variant="ghost" onClick={() => remove(i)}>Remove</Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => push("")}>Add another</Button>
        </>
      )}
    </FieldArray>
  );
}
```

Note: field names like `emails.0` contain a dot, so `id={name}` still works with `getElementById` but not with CSS selectors without escaping. `FocusFirstError` queries by `aria-invalid`, so it is unaffected.

### Async checks (e.g. “is this workspace URL free?”)

These need the backend, so leave them out for now. Once it is connected, add a Yup `.test()` that calls the API, and set `validateOnChange={false}` on that form so it doesn't fire on every keystroke.

## Testing

Test rules and schemas as plain functions, and forms the way a user drives them. Examples assume Vitest + React Testing Library + `@testing-library/user-event`.

**Open question:** the repo has no test runner yet; picking one (Vitest suggested) is a rollout step.

### Rule and schema tests (fast, no React)

```ts
// lib/validation/rules.test.ts
import { emailRule } from "./rules";

it("rejects a malformed email", async () => {
  await expect(emailRule.validate("not-an-email")).rejects.toThrow("Enter a valid email address");
});

it("trims the email", async () => {
  expect(await emailRule.validate("  a@b.co ")).toBe("a@b.co");
});
```

### Form tests (behaviour, through the UI)

```tsx
// app/(auth)/login/login-form.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LoginForm } from "./login-form";

it("shows field errors on empty submit and focuses the first one", async () => {
  render(<LoginForm />);
  await userEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(await screen.findByText("Enter your email address.")).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/)).toHaveFocus();
});

it("reaches onSubmit when the form is valid", async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByLabelText(/Email/), "a@b.co");
  await userEvent.type(screen.getByLabelText(/Password/), "secret");
  await userEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("isn’t connected to a backend yet");
});
```

## Gotchas and conventions

| Gotcha | What happens | Do this |
| --- | --- | --- |
| A field missing from `initialValues` | React warns about switching uncontrolled → controlled; Formik doesn’t mark it touched on submit, so its error never shows | Every field gets an initial value (`""`, `false`, `[]`) |
| Showing `errors.x` without `touched.x` | Errors appear before the user has typed | Use the form inputs; they check `touched` |
| Forgetting `"use client"` | Build error: hooks in a server component | Any file with `<Formik>` / `useField` is a client component |
| Using Formik `onChange` on Radix components | Nothing updates (Radix has no input event) | Use `helpers.setValue` (see `FormCheckbox`) |
| `<button>` inside a form without `type` | It submits the form (e.g. Show/Hide password) | Always set `type="button"` on non-submit buttons |
| Large forms (50+ fields) feel slow | Formik re-renders the whole form on each keystroke | Use `<FastField>` for independent fields, or split the form |
| `enableReinitialize` | Changing `initialValues` wipes what the user typed | Only for edit forms that load data once; never on login/sign-up |
| Library maintenance | Formik releases have been rare in recent years | Keep Formik usage behind the form inputs so a later swap touches few files |

**Accessibility checklist** (the form inputs do all of this; check it on any custom field):

- [ ] Every input has a visible `<label htmlFor>` matching its `id`.
- [ ] Required fields have `aria-required` plus the red asterisk.
- [ ] Invalid fields have `aria-invalid="true"` and `aria-describedby` pointing at the error.
- [ ] Form uses `noValidate` so browser popups don’t compete with our messages.
- [ ] Focus moves to the first invalid field after a failed submit.
- [ ] Submit button is disabled and relabelled while `isSubmitting`.

**Conventions**

- Error messages say what to do, in sentence case, ending with a full stop: “Enter your email address.”
- A field kind used by two or more forms gets a rule in `lib/validation/rules.ts`; never copy a rule into a schema.
- Per screen, in its route folder: `<screen>-form.tsx` (component `<Screen>Form`) and `<screen>-schema.ts` exporting `<screen>Schema`, `<Screen>Values`, `<screen>InitialValues`.
- No server actions or route handlers; `onSubmit` ends at `// TODO: connect to backend` until the backend is connected.

## Rollout plan

The login screen is the pilot: once it ships on Formik + Yup, every new form follows the same pattern.

1. Install `formik` and `yup`; add `lib/validation/rules.ts`.
2. Build `hooks/use-form-field-props.ts` and the `components/common/form-*.tsx` inputs; add them to `docs/component-inventory.md` and a demo on the `/components` gallery (empty, touched-with-error, disabled, submitting). The gallery page is a server component, so its demos use `DemoFormik` from `app/(dev)/components/form-demos.tsx` (a client-only Formik wrapper; each demo field gets a unique `name`).
3. Add `app/(auth)/login/login-schema.ts`, rewrite `login-form.tsx` as in the worked example, and delete `actions.ts`.
4. Pick and set up a test runner (Vitest suggested); add the rule and login form tests.
5. Use the pattern for sign-up, forgot/reset password and create-task as those screens are built.
6. Remove `zod` once nothing imports it.

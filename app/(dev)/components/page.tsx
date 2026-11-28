import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChartLine, KeyRound, Lock, MailCheck, Plus, SquareKanban, Trash2 } from "lucide-react";

import { BoardColumn } from "@/components/common/board-column";
import { FeatureCard } from "@/components/common/feature-card";
import { FormCheckbox } from "@/components/common/form-checkbox";
import { FocusFirstError, FormErrorBanner } from "@/components/common/form-error-banner";
import { FormPasswordField, FormTextField } from "@/components/common/form-text-field";
import { IconBadge } from "@/components/common/icon-badge";
import { IssueTypeIcon } from "@/components/common/issue-type-icon";
import { Logo } from "@/components/common/logo";
import { PasswordInput } from "@/components/common/password-input";
import { PasswordStrengthMeter } from "@/components/common/password-strength-meter";
import { TaskCard } from "@/components/common/task-card";
import { TextLink } from "@/components/common/text-link";
import { UserAvatar } from "@/components/common/user-avatar";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { DemoFormik } from "./form-demos";

export const metadata: Metadata = { title: "Components" };

/**
 * Dev-only gallery of every built component, with all variants and states.
 * The registry (docs/component-inventory.md) is the source of truth: when a
 * component is built or extended, add or update its demo here in the same change.
 */

type Entry = { id: string; name: string; path: string };

const GROUPS: { title: string; folder: string; entries: Entry[] }[] = [
  {
    title: "Primitives",
    folder: "components/ui",
    entries: [
      { id: "button", name: "Button", path: "components/ui/button.tsx" },
      { id: "input", name: "Input", path: "components/ui/input.tsx" },
      { id: "label", name: "Label", path: "components/ui/label.tsx" },
      { id: "checkbox", name: "Checkbox", path: "components/ui/checkbox.tsx" },
      { id: "field", name: "Field", path: "components/ui/field.tsx" },
      { id: "card", name: "Card", path: "components/ui/card.tsx" },
      { id: "separator", name: "Separator", path: "components/ui/separator.tsx" },
      { id: "avatar", name: "Avatar", path: "components/ui/avatar.tsx" },
    ],
  },
  {
    title: "Composites",
    folder: "components/common",
    entries: [
      { id: "logo", name: "Logo", path: "components/common/logo.tsx" },
      { id: "text-link", name: "TextLink", path: "components/common/text-link.tsx" },
      { id: "password-input", name: "PasswordInput", path: "components/common/password-input.tsx" },
      { id: "user-avatar", name: "UserAvatar", path: "components/common/user-avatar.tsx" },
      { id: "issue-type-icon", name: "IssueTypeIcon", path: "components/common/issue-type-icon.tsx" },
      { id: "task-card", name: "TaskCard", path: "components/common/task-card.tsx" },
      { id: "board-column", name: "BoardColumn", path: "components/common/board-column.tsx" },
      { id: "feature-card", name: "FeatureCard", path: "components/common/feature-card.tsx" },
      { id: "icon-badge", name: "IconBadge", path: "components/common/icon-badge.tsx" },
      {
        id: "password-strength-meter",
        name: "PasswordStrengthMeter",
        path: "components/common/password-strength-meter.tsx",
      },
      { id: "form-text-field", name: "FormTextField", path: "components/common/form-text-field.tsx" },
      { id: "form-password-field", name: "FormPasswordField", path: "components/common/form-text-field.tsx" },
      { id: "form-checkbox", name: "FormCheckbox", path: "components/common/form-checkbox.tsx" },
      { id: "form-error-banner", name: "FormErrorBanner", path: "components/common/form-error-banner.tsx" },
    ],
  },
  {
    title: "Layout",
    folder: "components/layout",
    entries: [{ id: "auth-layout", name: "AuthLayout", path: "components/layout/auth-layout.tsx" }],
  },
];

const ENTRIES = Object.fromEntries(GROUPS.flatMap((g) => g.entries).map((e) => [e.id, e]));

/* ---------- page helpers (not components of the library) ---------- */

function Showcase({ id, summary, children }: { id: string; summary: string; children: ReactNode }) {
  const { name, path } = ENTRIES[id];
  return (
    <section id={id} className="flex scroll-mt-8 flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h3 className="text-heading-3">{name}</h3>
        <code className="text-caption font-mono text-ink-muted">{path}</code>
        <p className="text-body text-ink-muted">{summary}</p>
      </header>
      <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6">{children}</div>
    </section>
  );
}

function Demo({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-overline uppercase text-ink-muted">{label}</p>
      <div className={className ?? "flex flex-wrap items-center gap-3"}>{children}</div>
    </div>
  );
}

const SAMPLE_PEOPLE = ["Grace Song", "Amir Khan", "Rosa Medina", "Priya Nair", "Tom Ellis"];

/* ---------- page ---------- */

export default function ComponentsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-6 py-12 lg:px-8">
      <nav aria-label="Components" className="sticky top-12 hidden h-fit w-48 shrink-0 flex-col gap-6 lg:flex">
        {GROUPS.map((g) => (
          <div key={g.title} className="flex flex-col gap-2">
            <p className="text-overline uppercase text-ink-muted">{g.title}</p>
            <ul className="flex flex-col gap-1">
              {g.entries.map((e) => (
                <li key={e.id}>
                  <a href={`#${e.id}`} className="rounded-sm text-body text-ink hover:text-brand-600">
                    {e.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Separator />
        <TextLink href="/theme" variant="muted" className="text-small">
          Theme tokens →
        </TextLink>
      </nav>

      <main className="flex min-w-0 flex-1 flex-col gap-14">
        <header className="flex flex-col gap-2">
          <h1 className="text-page-title">Components</h1>
          <p className="text-body text-ink-muted">
            Every component built so far, with its variants and states. The registry with variants, “looks like” notes
            and screens is <code className="font-mono text-code">docs/component-inventory.md</code>. Tokens are on{" "}
            <TextLink href="/theme">/theme</TextLink>.
          </p>
        </header>

        {/* ============================ Primitives ============================ */}
        <GroupHeading title="Primitives" folder="components/ui" />

        <Showcase id="button" summary="Actions. Wrap a next/link with asChild for navigation that looks like a button.">
          <Demo label="variant">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </Demo>
          <Demo label="size">
            <Button size="xs">xs</Button>
            <Button size="sm">sm · 32</Button>
            <Button>default · 40</Button>
            <Button size="lg">lg · 44</Button>
            <Button variant="link" size="inline">
              inline
            </Button>
          </Demo>
          <Demo label="with icon · icon-only">
            <Button>
              <Plus aria-hidden="true" />
              New task
            </Button>
            <Button variant="outline">
              <KeyRound aria-hidden="true" />
              Continue with SSO
            </Button>
            <Button size="icon-sm" variant="ghost" aria-label="Delete">
              <Trash2 aria-hidden="true" />
            </Button>
            <Button size="icon" variant="outline" aria-label="Next">
              <ArrowRight aria-hidden="true" />
            </Button>
          </Demo>
          <Demo label="states">
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>
              Disabled
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">asChild → Link</Link>
            </Button>
          </Demo>
        </Showcase>

        <Showcase id="input" summary="Single-line text field. Focus turns the 2px border brand-600.">
          <Demo label="states" className="grid max-w-md gap-3">
            <Input placeholder="Default (placeholder)" aria-label="Default" />
            <Input defaultValue="With a value" aria-label="With value" />
            <Input placeholder="Invalid" aria-invalid aria-label="Invalid" />
            <Input placeholder="Disabled" disabled aria-label="Disabled" />
          </Demo>
        </Showcase>

        <Showcase id="label" summary="Form label. 12px semibold ink-muted; `required` adds the red asterisk.">
          <Demo label="variants">
            <Label>Optional field</Label>
            <Label required>Required field</Label>
          </Demo>
        </Showcase>

        <Showcase id="checkbox" summary='Radix checkbox; with `name` it submits "on" in a form.'>
          <Demo label="states">
            <div className="flex items-center gap-2">
              <Checkbox id="cb-1" />
              <Label htmlFor="cb-1" className="text-body text-ink">
                Unchecked
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-2" defaultChecked />
              <Label htmlFor="cb-2" className="text-body text-ink">
                Checked
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-3" disabled />
              <Label htmlFor="cb-3" className="text-body text-ink">
                Disabled
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-4" aria-invalid />
              <Label htmlFor="cb-4" className="text-body text-ink">
                Invalid
              </Label>
            </div>
          </Demo>
        </Showcase>

        <Showcase id="field" summary="Form layout: label, control, description and error. Use it for every form field.">
          <FieldGroup className="max-w-md gap-5">
            <Field>
              <FieldLabel htmlFor="f-name" required>
                Workspace name
              </FieldLabel>
              <Input id="f-name" placeholder="e.g. Product" />
              <FieldDescription>Shown in the sidebar and in invites.</FieldDescription>
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="f-email" required>
                Email
              </FieldLabel>
              <Input id="f-email" defaultValue="grace@" aria-invalid aria-describedby="f-email-error" />
              <FieldError id="f-email-error">Enter a valid email address, like you@company.com.</FieldError>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="f-remember" />
              <FieldLabel htmlFor="f-remember" className="text-body text-ink">
                Horizontal field (checkbox + label)
              </FieldLabel>
            </Field>
            <FieldSeparator>or</FieldSeparator>
          </FieldGroup>
        </Showcase>

        <Showcase id="card" summary="White container, 8px radius, shadow-card. The login card adds shadow-raised.">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Card title</CardTitle>
                <CardDescription>Card description in body ink-muted.</CardDescription>
              </CardHeader>
              <CardContent className="text-body">Content area.</CardContent>
              <CardFooter className="gap-2">
                <Button size="sm">Save</Button>
                <Button size="sm" variant="ghost">
                  Cancel
                </Button>
              </CardFooter>
            </Card>
            <Card className="shadow-raised">
              <CardHeader>
                <CardTitle>With shadow-raised</CardTitle>
                <CardDescription>As used for the auth card.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Showcase>

        <Showcase id="separator" summary="1px divider. For a line with text in the middle use FieldSeparator.">
          <Demo label="horizontal · vertical" className="flex flex-col gap-4">
            <Separator />
            <div className="flex h-6 items-center gap-3 text-small text-ink-muted">
              Privacy <Separator orientation="vertical" /> Terms <Separator orientation="vertical" /> Help
            </div>
          </Demo>
        </Showcase>

        <Showcase id="avatar" summary="Raw shadcn avatar. Prefer UserAvatar; AvatarGroup is the base for the future AvatarStack.">
          <Demo label="size">
            <Avatar size="sm">
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>LG</AvatarFallback>
            </Avatar>
          </Demo>
          <Demo label="AvatarGroup">
            <AvatarGroup>
              {SAMPLE_PEOPLE.slice(0, 4).map((n) => (
                <UserAvatar key={n} name={n} />
              ))}
            </AvatarGroup>
          </Demo>
        </Showcase>

        {/* ============================ Composites ============================ */}
        <GroupHeading title="Composites" folder="components/common" />

        <Showcase id="logo" summary="Taskify mark and wordmark, drawn inline so colours follow `tone`.">
          <Demo label="tone: default · variant: full, mark">
            <Logo />
            <Logo variant="mark" />
          </Demo>
          <Demo label="tone: inverse (on brand-900)" className="flex items-center gap-6 rounded-lg bg-brand-900 p-4">
            <Logo tone="inverse" />
            <Logo tone="inverse" variant="mark" />
          </Demo>
        </Showcase>

        <Showcase id="text-link" summary="In-text navigation built on next/link. `default` matches Button variant=link.">
          <Demo label="variant">
            <p className="text-body text-ink-muted">
              New to Taskify? <TextLink href="/signup">Create an account</TextLink>
            </p>
            <TextLink href="/help" variant="muted" className="text-small">
              Muted (footer) link
            </TextLink>
          </Demo>
        </Showcase>

        <Showcase id="password-input" summary="Input with a Show / Hide toggle. Takes every Input prop except `type`.">
          <Demo label="states" className="grid max-w-md gap-3">
            <PasswordInput placeholder="Enter password" aria-label="Password" />
            <PasswordInput defaultValue="correct-horse" aria-label="Password with value" />
            <PasswordInput placeholder="Invalid" aria-invalid aria-label="Invalid password" />
          </Demo>
        </Showcase>

        <Showcase id="user-avatar" summary="Initials on an avatar colour picked from the name (or pinned with `color`).">
          <Demo label="size: sm · default · lg">
            <UserAvatar name="Grace Song" size="sm" />
            <UserAvatar name="Grace Song" />
            <UserAvatar name="Grace Song" size="lg" />
          </Demo>
          <Demo label="color: 1 – 5">
            {([1, 2, 3, 4, 5] as const).map((c) => (
              <UserAvatar key={c} name={SAMPLE_PEOPLE[c - 1]} color={c} />
            ))}
          </Demo>
        </Showcase>

        <Showcase id="issue-type-icon" summary="16px square showing a task's type.">
          <Demo label="type">
            {(["story", "bug", "task"] as const).map((t) => (
              <span key={t} className="flex items-center gap-2 text-body">
                <IssueTypeIcon type={t} />
                {t}
              </span>
            ))}
          </Demo>
        </Showcase>

        <Showcase id="task-card" summary="Board card. In a narrow column the key truncates instead of pushing the avatar out.">
          <Demo label="examples" className="flex flex-wrap items-start gap-3 rounded-lg bg-surface-sunken p-3">
            <TaskCard
              className="w-56"
              title="Add OAuth refresh flow"
              taskKey="TSK-142"
              type="story"
              assignee={{ name: "Grace Song", color: 1 }}
            />
            <TaskCard className="w-56" title="Fix due-date timezone shift" taskKey="TSK-138" type="bug" />
            <TaskCard
              className="w-32"
              title="Narrow card"
              taskKey="TSK-1024"
              type="task"
              assignee={{ name: "Priya Nair", color: 4 }}
            />
          </Demo>
        </Showcase>

        <Showcase id="board-column" summary="Column title + count with a stack of TaskCards.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Demo label="tone: default" className="block">
              <BoardColumn title="To do" count={2}>
                <TaskCard title="Export board as CSV" taskKey="TSK-151" type="task" assignee={{ name: "Amir Khan", color: 2 }} />
                <TaskCard title="Sprint burndown chart" taskKey="TSK-129" type="story" />
              </BoardColumn>
            </Demo>
            <Demo label="tone: inverse" className="block rounded-lg bg-brand-900 p-3">
              <BoardColumn title="Done" count={1} tone="inverse">
                <TaskCard
                  title="Invite teammates by email"
                  taskKey="TSK-117"
                  type="task"
                  assignee={{ name: "Priya Nair", color: 4 }}
                />
              </BoardColumn>
            </Demo>
          </div>
        </Showcase>

        <Showcase
          id="feature-card"
          summary="Feature highlight or numbered step for brand-900 panels (sign-up and forgot-password brand panels)."
        >
          <Demo label="icon + description (sign up)" className="flex max-w-md flex-col gap-4 rounded-lg bg-brand-900 p-4">
            <FeatureCard
              icon={SquareKanban}
              title="Boards and backlogs"
              description="Drag issues across columns and keep the backlog groomed."
            />
            <FeatureCard icon={ChartLine} title="Short description" description="One line." />
          </Demo>
          <Demo label="step, title only (forgot password)" className="max-w-md rounded-lg bg-brand-900 p-4">
            <ol className="flex flex-col gap-3">
              {["Enter the email you use for Taskify", "Open the recovery link we email you", "Choose a new password and log in"].map(
                (title, i) => (
                  <li key={title}>
                    <FeatureCard step={i + 1} title={title} />
                  </li>
                ),
              )}
            </ol>
          </Demo>
          <Demo label="step + description" className="max-w-md rounded-lg bg-brand-900 p-4">
            <FeatureCard step={1} title="With a description" description="The marker top-aligns when there are two lines." />
          </Demo>
        </Showcase>

        <Showcase id="icon-badge" summary="Decorative icon in a light-blue circle above a card title (forgot password).">
          <Demo label="icons in use">
            <IconBadge icon={Lock} />
            <IconBadge icon={MailCheck} />
          </Demo>
        </Showcase>

        <Showcase
          id="password-strength-meter"
          summary="Four segments, one per check in newPasswordRule (8+ characters, upper + lower case, number, symbol). Use FormPasswordField `showStrength` in forms."
        >
          <Demo label="score 0 – 4" className="grid max-w-md gap-4">
            {[
              ["0 · empty", ""],
              ["1 · weak", "Abc"],
              ["2 · fair", "Abc1"],
              ["3 · good", "Abcdefg1"],
              ["4 · strong", "Abcdefg1!"],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-small text-ink-muted">
                  {label} <code className="font-mono text-code">{value && `"${value}"`}</code>
                </span>
                <PasswordStrengthMeter value={value} />
              </div>
            ))}
          </Demo>
        </Showcase>

        <Showcase
          id="form-text-field"
          summary="Formik-aware Label + Input + optional `description` hint + error. Reads value, error and touched from Formik by `name`; the error shows once the field is touched. Render inside <Formik>."
        >
          <Demo label="states" className="grid max-w-md gap-5">
            <DemoFormik initialValues={{ "ft-empty": "" }} rules={{ "ft-empty": "email" }}>
              <FormTextField
                name="ft-empty"
                label="Empty · required (blur it to validate)"
                type="email"
                placeholder="you@company.com"
                required
              />
            </DemoFormik>
            <DemoFormik
              initialValues={{ "ft-error": "not-an-email" }}
              rules={{ "ft-error": "email" }}
              initialTouched={{ "ft-error": true }}
              initialErrors={{ "ft-error": "Enter a valid email address, like you@company.com." }}
            >
              <FormTextField name="ft-error" label="Touched with error" type="email" required />
            </DemoFormik>
            <DemoFormik initialValues={{ "ft-value": "Grace Song" }} rules={{ "ft-value": "name" }}>
              <FormTextField name="ft-value" label="Optional · with value" />
            </DemoFormik>
            <DemoFormik initialValues={{ "ft-description": "" }} rules={{ "ft-description": "organisationName" }}>
              <FormTextField
                name="ft-description"
                label="With description"
                placeholder="e.g. Acme Engineering"
                required
                description={
                  <>
                    Your URL: <span className="font-semibold text-ink">taskify.app/your-organisation</span>
                  </>
                }
              />
            </DemoFormik>
            <DemoFormik initialValues={{ "ft-disabled": "you@company.com" }}>
              <FormTextField name="ft-disabled" label="Disabled" disabled />
            </DemoFormik>
          </Demo>
        </Showcase>

        <Showcase
          id="form-password-field"
          summary="FormTextField with PasswordInput (Show / Hide). `labelAside` puts a link on the label row; `showStrength` adds the strength meter (type to see it fill)."
        >
          <Demo label="states" className="grid max-w-md gap-5">
            <DemoFormik initialValues={{ "fp-empty": "" }} rules={{ "fp-empty": "password" }}>
              <FormPasswordField
                name="fp-empty"
                label="Password"
                placeholder="Enter password"
                required
                labelAside={
                  <TextLink href="/forgot-password" className="text-label">
                    Forgot password?
                  </TextLink>
                }
              />
            </DemoFormik>
            <DemoFormik
              initialValues={{ "fp-error": "short" }}
              rules={{ "fp-error": "newPassword" }}
              initialTouched={{ "fp-error": true }}
              initialErrors={{ "fp-error": "Use at least 8 characters." }}
            >
              <FormPasswordField name="fp-error" label="New password · touched with error" required />
            </DemoFormik>
            <DemoFormik initialValues={{ "fp-strength": "" }} rules={{ "fp-strength": "newPassword" }}>
              <FormPasswordField
                name="fp-strength"
                label="New password · showStrength + description"
                placeholder="Create a password"
                required
                showStrength
                description="Use 8+ characters with upper and lower case letters, a number and a symbol."
              />
            </DemoFormik>
            <DemoFormik initialValues={{ "fp-strength-typed": "Abcdefg1" }} rules={{ "fp-strength-typed": "newPassword" }}>
              <FormPasswordField
                name="fp-strength-typed"
                label="showStrength · typed (3 of 4)"
                required
                showStrength
                description="Use 8+ characters with upper and lower case letters, a number and a symbol."
              />
            </DemoFormik>
            <DemoFormik initialValues={{ "fp-disabled": "secret-password" }}>
              <FormPasswordField name="fp-disabled" label="Disabled" disabled />
            </DemoFormik>
          </Demo>
        </Showcase>

        <Showcase
          id="form-checkbox"
          summary="Checkbox + label bound to a boolean Formik field (uses setValue; Radix has no onChange). `label` can hold links; an error shows once touched (e.g. must-accept terms)."
        >
          <Demo label="states">
            <DemoFormik initialValues={{ "fc-off": false }}>
              <FormCheckbox name="fc-off" label="Unchecked" />
            </DemoFormik>
            <DemoFormik initialValues={{ "fc-on": true }}>
              <FormCheckbox name="fc-on" label="Checked" />
            </DemoFormik>
            <DemoFormik initialValues={{ "fc-disabled": false }}>
              <FormCheckbox name="fc-disabled" label="Disabled" disabled />
            </DemoFormik>
          </Demo>
          <Demo label="label with links · touched with error" className="grid max-w-md gap-5">
            <DemoFormik initialValues={{ "fc-terms": false }} rules={{ "fc-terms": "acceptTerms" }}>
              <FormCheckbox
                name="fc-terms"
                label={
                  <>
                    I agree to the <TextLink href="/terms" className="font-normal">Terms of service</TextLink> and{" "}
                    <TextLink href="/privacy" className="font-normal">Privacy policy</TextLink>.
                  </>
                }
              />
            </DemoFormik>
            <DemoFormik
              initialValues={{ "fc-terms-error": false }}
              rules={{ "fc-terms-error": "acceptTerms" }}
              initialTouched={{ "fc-terms-error": true }}
              initialErrors={{ "fc-terms-error": "Agree to the Terms of service and Privacy policy to continue." }}
            >
              <FormCheckbox name="fc-terms-error" label="I agree to the Terms of service and Privacy policy." />
            </DemoFormik>
          </Demo>
        </Showcase>

        <Showcase
          id="form-error-banner"
          summary="FormErrorBanner shows Formik `status.formError`. FocusFirstError (same file, renders nothing) focuses the first invalid field after a failed submit."
        >
          <Demo label="banner with a message" className="grid max-w-md gap-3">
            <DemoFormik initialValues={{}} initialStatus={{ formError: "Sign-in isn’t connected to a backend yet." }}>
              <FormErrorBanner />
            </DemoFormik>
          </Demo>
          <Demo label="FocusFirstError · submit empty, focus jumps to Email" className="grid max-w-md gap-3">
            <DemoFormik initialValues={{ "ff-email": "", "ff-password": "" }} rules={{ "ff-email": "email", "ff-password": "password" }}>
              <div className="flex flex-col gap-4">
                <FocusFirstError />
                <FormTextField name="ff-email" label="Email" type="email" required />
                <FormPasswordField name="ff-password" label="Password" required />
                <Button type="submit" className="w-fit">
                  Submit
                </Button>
              </div>
            </DemoFormik>
          </Demo>
        </Showcase>

        {/* ============================ Layout ============================ */}
        <GroupHeading title="Layout" folder="components/layout" />

        <Showcase id="auth-layout" summary="Full-page split screen; too big to preview inline.">
          <p className="text-body text-ink-muted">
            Navy brand panel (40%, min 560px, hidden below lg) + centred form area. Each route&apos;s{" "}
            <code className="font-mono text-code">layout.tsx</code> passes <code className="font-mono text-code">headline</code>,{" "}
            <code className="font-mono text-code">subline</code> and <code className="font-mono text-code">panel</code>: the
            sample board (<code className="font-mono text-code">AuthBoardPreview</code>) on{" "}
            <TextLink href="/login">/login</TextLink>, FeatureCards on <TextLink href="/signup">/signup</TextLink>, numbered
            FeatureCards (<code className="font-mono text-code">step</code>) on{" "}
            <TextLink href="/forgot-password">/forgot-password</TextLink>.
          </p>
        </Showcase>
      </main>
    </div>
  );
}

function GroupHeading({ title, folder }: { title: string; folder: string }) {
  return (
    <div className="-mb-6 flex items-baseline gap-3 border-b border-border pb-2">
      <h2 className="text-heading-1">{title}</h2>
      <code className="text-caption font-mono text-ink-muted">{folder}/</code>
    </div>
  );
}

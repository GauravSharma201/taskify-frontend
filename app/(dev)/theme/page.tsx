import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Theme" };

/**
 * Dev-only reference page for the Taskify design tokens.
 * Not a component; safe to delete once the component library exists.
 */

const colorGroups: { name: string; tokens: string[] }[] = [
  { name: "Brand", tokens: ["brand-900", "brand-800", "brand-600", "brand-100"] },
  { name: "Text", tokens: ["ink", "ink-muted", "ink-subtle", "on-brand", "on-brand-muted"] },
  {
    name: "Surfaces",
    tokens: ["surface", "surface-sunken", "surface-input", "surface-hover", "border", "border-strong", "overlay"],
  },
  {
    name: "Status",
    tokens: [
      "status-todo-bg",
      "status-todo-fg",
      "status-progress-bg",
      "status-progress-fg",
      "status-review-bg",
      "status-review-fg",
      "status-done-bg",
      "status-done-fg",
    ],
  },
  {
    name: "Feedback",
    tokens: ["success", "danger", "danger-text", "warning-bg", "warning-text", "priority-medium"],
  },
  { name: "Avatars", tokens: ["avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5"] },
  { name: "Charts", tokens: ["chart-1", "chart-2", "chart-ideal"] },
  {
    name: "shadcn semantic",
    tokens: [
      "background",
      "foreground",
      "primary",
      "primary-foreground",
      "secondary",
      "muted",
      "muted-foreground",
      "accent",
      "accent-foreground",
      "destructive",
      "input",
      "ring",
    ],
  },
];

const typeScale: { cls: string; name: string; spec: string; sample: string }[] = [
  { cls: "text-display", name: "display", spec: "34/41 · 700", sample: "Plan sprints, track tasks, ship together." },
  { cls: "text-page-title", name: "page-title", spec: "26/32 · 600", sample: "Welcome back" },
  { cls: "text-heading-1", name: "heading-1", spec: "24/30 · 600", sample: "Create your organisation" },
  { cls: "text-heading-2", name: "heading-2", spec: "20/26 · 600", sample: "Create a project" },
  { cls: "text-heading-3", name: "heading-3", spec: "16/22 · 600", sample: "Assigned to me" },
  { cls: "text-title-sm", name: "title-sm", spec: "15/20 · 600", sample: "Mobile app v2" },
  { cls: "text-body-lg", name: "body-lg", spec: "16/24 · 400", sample: "One board for your team’s backlog." },
  { cls: "text-body", name: "body", spec: "14/20 · 400", sample: "Fix due-date timezone shift on task cards" },
  { cls: "text-body-strong", name: "body-strong", spec: "14/20 · 600", sample: "Create account" },
  { cls: "text-small", name: "small", spec: "13/18 · 400", sample: "Owned by Aisha K." },
  { cls: "text-label", name: "label", spec: "12/16 · 600", sample: "Email" },
  { cls: "text-caption", name: "caption", spec: "12/16 · 400", sample: "Use 8+ characters with letters and a number." },
  { cls: "text-overline uppercase", name: "overline", spec: "11/14 · 700", sample: "In progress" },
  { cls: "text-code font-mono", name: "code", spec: "13/20 · mono", sample: 'status IN ("To Do") ORDER BY due ASC' },
];

const radii = [
  { cls: "rounded-sm", name: "radius-sm · 3px" },
  { cls: "rounded-md", name: "radius-md · 4px" },
  { cls: "rounded-lg", name: "radius-lg · 6px" },
  { cls: "rounded-xl", name: "radius-xl · 8px" },
  { cls: "rounded-pill", name: "radius-pill · 16px" },
  { cls: "rounded-full", name: "radius-full" },
];

const shadows = [
  { cls: "shadow-card", name: "shadow-card" },
  { cls: "shadow-raised", name: "shadow-raised" },
  { cls: "shadow-menu", name: "shadow-menu" },
  { cls: "shadow-overlay", name: "shadow-overlay" },
  { cls: "shadow-panel", name: "shadow-panel" },
];

const lozenges = [
  { label: "To do", cls: "bg-status-todo-bg text-status-todo-fg" },
  { label: "In progress", cls: "bg-status-progress-bg text-status-progress-fg" },
  { label: "In review", cls: "bg-status-review-bg text-status-review-fg" },
  { label: "Done", cls: "bg-status-done-bg text-status-done-fg" },
  { label: "Invited", cls: "bg-warning-bg text-warning-text" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-heading-3 text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default function ThemePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-8 py-12">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Image src="/brand/taskify-logo.svg" alt="Taskify" width={168} height={40} priority />
          <Image src="/brand/taskify-mark.svg" alt="" width={32} height={32} />
        </div>
        <h1 className="text-page-title">Theme tokens</h1>
        <p className="text-body text-ink-muted">
          Every value below comes from the Taskify Design System. Use these classes when building components.
          Built components are listed on{" "}
          <Link href="/components" className="text-body-strong text-brand-600 hover:underline">
            /components
          </Link>
          .
        </p>
      </header>

      <Section title="Colours">
        {colorGroups.map((group) => (
          <div key={group.name} className="flex flex-col gap-2">
            <p className="text-overline uppercase text-ink-muted">{group.name}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {group.tokens.map((token) => (
                <div key={token} className="flex flex-col gap-1">
                  <div
                    className="h-14 rounded-lg border border-border"
                    style={{ background: `var(--${token === "border" ? "border-default" : token})` }}
                  />
                  <code className="text-caption font-mono text-ink-muted">{token}</code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Status lozenges">
        <div className="flex flex-wrap gap-2">
          {lozenges.map((l) => (
            <span key={l.label} className={`rounded-sm px-1 py-0.5 text-overline uppercase ${l.cls}`}>
              {l.label}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Type scale (Inter, JetBrains Mono)">
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border">
          {typeScale.map((t) => (
            <div key={t.name} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:gap-6">
              <div className="w-40 shrink-0">
                <p className="text-label text-ink">{t.name}</p>
                <p className="text-caption text-ink-muted">{t.spec}</p>
              </div>
              <p className={t.cls}>{t.sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius">
        <div className="flex flex-wrap gap-4">
          {radii.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div className={`size-16 border-2 border-brand-600 bg-brand-100 ${r.cls}`} />
              <span className="text-caption text-ink-muted">{r.name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadows">
        <div className="flex flex-wrap gap-6 rounded-xl bg-surface-sunken p-6">
          {shadows.map((s) => (
            <div key={s.name} className={`flex h-20 w-36 items-center justify-center rounded-lg bg-surface ${s.cls}`}>
              <span className="text-caption text-ink-muted">{s.name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Control sizes">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex h-control-sm items-center rounded-md bg-primary px-3 text-body-strong text-primary-foreground">
            control-sm · 32
          </div>
          <div className="flex h-control-md items-center rounded-md bg-primary px-4 text-body-strong text-primary-foreground">
            control-md · 40
          </div>
          <div className="flex h-control-lg items-center rounded-md bg-primary px-4 text-body-strong text-primary-foreground">
            control-lg · 44
          </div>
          <div className="flex h-control-md items-center rounded-md border-2 border-border bg-surface-input px-3 text-body text-ink-muted">
            Input fill + 2px border
          </div>
        </div>
      </Section>

      <Section title="Brand panel">
        <div className="flex flex-col gap-2 rounded-xl bg-brand-900 p-10">
          <p className="text-display text-on-brand">Plan, track and ship work as one team.</p>
          <p className="text-body-lg text-on-brand-muted">Workspaces, projects and tasks for your whole organisation.</p>
        </div>
      </Section>
    </main>
  );
}

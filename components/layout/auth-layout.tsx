import type { ComponentProps, ReactNode } from "react";

import { BoardColumn } from "@/components/common/board-column";
import { Logo } from "@/components/common/logo";
import { TaskCard } from "@/components/common/task-card";

const GRACE = { name: "Grace Song", color: 1 } as const;

/** Sample board shown in the brand panel. Illustration only. */
const PREVIEW: { title: string; count: number; tasks: ComponentProps<typeof TaskCard>[] }[] = [
  {
    title: "To do",
    count: 4,
    tasks: [
      { title: "Add OAuth refresh flow", taskKey: "TSK-142", type: "story", assignee: GRACE },
      { title: "Export board as CSV", taskKey: "TSK-151", type: "task", assignee: { name: "Amir Khan", color: 2 } },
    ],
  },
  {
    title: "In progress",
    count: 2,
    tasks: [
      { title: "Fix due-date timezone shift", taskKey: "TSK-138", type: "bug", assignee: { name: "Rosa Medina", color: 3 } },
      { title: "Sprint burndown chart", taskKey: "TSK-129", type: "story", assignee: GRACE },
    ],
  },
  {
    title: "Done",
    count: 7,
    tasks: [
      { title: "Invite teammates by email", taskKey: "TSK-117", type: "task", assignee: { name: "Priya Nair", color: 4 } },
    ],
  },
];

/** Sample 3-column board for the brand panel (login). Decorative: the real board lives in the app. */
export function AuthBoardPreview() {
  return (
    <div aria-hidden="true" inert className="grid max-w-[480px] grid-cols-3 gap-3">
      {PREVIEW.map((col) => (
        <BoardColumn key={col.title} title={col.title} count={col.count} tone="inverse">
          {col.tasks.map((t) => (
            <TaskCard key={t.taskKey} {...t} />
          ))}
        </BoardColumn>
      ))}
    </div>
  );
}

type AuthLayoutProps = {
  /** Big panel headline, e.g. "Plan sprints, track issues, ship together." */
  headline: string;
  /** Line under the headline */
  subline: string;
  /** Panel body under the headline, e.g. <AuthBoardPreview /> or a list of FeatureCards */
  panel: ReactNode;
  /** The form card */
  children: ReactNode;
};

/** Split auth screen: brand panel on the left (lg+), form area on the right. Each route's layout picks the panel. */
export function AuthLayout({ headline, subline, panel, children }: AuthLayoutProps) {
  return (
    // Panel: 40% of the screen, but never under 560px so the sample board fits.
    <div className="grid min-h-dvh flex-1 lg:grid-cols-[minmax(560px,2fr)_3fr]">
      <aside className="hidden flex-col gap-10 bg-brand-900 px-10 py-11 text-on-brand lg:flex xl:px-13">
        <Logo tone="inverse" />
        <div className="flex max-w-[480px] flex-col gap-3">
          <p className="text-display">{headline}</p>
          <p className="text-body-lg text-on-brand-muted">{subline}</p>
        </div>
        {panel}
      </aside>
      <main className="flex flex-col items-center justify-center gap-8 bg-surface-sunken px-4 py-10 sm:px-6">
        <Logo className="lg:hidden" />
        {children}
      </main>
    </div>
  );
}

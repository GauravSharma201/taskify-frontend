import type { ReactNode } from "react";
import { ChartLine, SquareKanban, Users } from "lucide-react";

import { FeatureCard } from "@/components/common/feature-card";
import { AuthLayout } from "@/components/layout/auth-layout";

const FEATURES = [
  {
    icon: SquareKanban,
    title: "Boards and backlogs",
    description: "Drag issues across columns and keep the backlog groomed.",
  },
  {
    icon: ChartLine,
    title: "Sprints and reports",
    description: "Plan sprints and track progress with burndown charts.",
  },
  {
    icon: Users,
    title: "Built for teams",
    description: "Assign work, @mention teammates and get notified on changes.",
  },
];

export default function SignupLayout({ children }: { children: ReactNode }) {
  return (
    <AuthLayout
      headline="Set up your team’s workspace in minutes."
      subline="Create a project, invite your team and start your first sprint."
      panel={
        <ul className="flex max-w-[420px] flex-col gap-4">
          {FEATURES.map((f) => (
            <li key={f.title}>
              <FeatureCard {...f} />
            </li>
          ))}
        </ul>
      }
    >
      {children}
    </AuthLayout>
  );
}

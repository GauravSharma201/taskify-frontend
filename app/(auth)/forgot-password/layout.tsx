import type { ReactNode } from "react";

import { FeatureCard } from "@/components/common/feature-card";
import { AuthLayout } from "@/components/layout/auth-layout";

const STEPS = [
  "Enter the email you use for Taskify",
  "Open the recovery link we email you",
  "Choose a new password and log in",
];

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return (
    <AuthLayout
      headline="Locked out? You’ll be back on your board shortly."
      subline="Resetting your password takes three quick steps."
      panel={
        <ol className="flex max-w-[460px] flex-col gap-3">
          {STEPS.map((title, i) => (
            <li key={title}>
              <FeatureCard step={i + 1} title={title} />
            </li>
          ))}
        </ol>
      }
    >
      {children}
    </AuthLayout>
  );
}

import type { ReactNode } from "react";

import { AuthBoardPreview, AuthLayout } from "@/components/layout/auth-layout";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <AuthLayout
      headline="Plan sprints, track issues, ship together."
      subline="One board for your team’s backlog, in-flight work and releases."
      panel={<AuthBoardPreview />}
    >
      {children}
    </AuthLayout>
  );
}

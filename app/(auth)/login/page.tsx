import { Suspense } from "react";
import type { Metadata } from "next";

import { TextLink } from "@/components/common/text-link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in",
};

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
  { href: "/help", label: "Help" },
] as const;

export default function LoginPage() {
  return (
    <Card className="w-full max-w-[434px] gap-6 px-6 py-8 shadow-raised sm:px-10">
      <CardHeader className="gap-1 px-0 text-center">
        <CardTitle>
          <h1 className="text-heading-1">Log in to continue</h1>
        </CardTitle>
        <CardDescription>Welcome back — pick up where your team left off.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-0">
        {/* LoginForm calls useSearchParams() — Suspense is required by Next.js App Router */}
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-body text-ink-muted">
          New to Taskify? <TextLink href="/signup">Create an account</TextLink>
        </p>
      </CardContent>

      <CardFooter className="flex-col gap-4 px-0">
        <Separator />
        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-small">
          {LEGAL_LINKS.map((l) => (
            <TextLink key={l.href} href={l.href} variant="muted">
              {l.label}
            </TextLink>
          ))}
        </nav>
      </CardFooter>
    </Card>
  );
}

import type { Metadata } from "next";

import { TextLink } from "@/components/common/text-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create your account",
};

export default function SignupPage() {
  return (
    <Card className="w-full max-w-[434px] gap-6 px-6 py-8 shadow-raised sm:px-10">
      <CardHeader className="gap-1 px-0 text-center">
        <CardTitle>
          <h1 className="text-heading-1">Create your account</h1>
        </CardTitle>
        <CardDescription>Free for teams up to 10 users.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-0">
        <SignupForm />
        <p className="text-center text-body text-ink-muted">
          Already have an account? <TextLink href="/login">Log in</TextLink>
        </p>
      </CardContent>
    </Card>
  );
}

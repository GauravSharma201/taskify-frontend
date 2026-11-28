import type { Metadata } from "next";

import { Card } from "@/components/ui/card";

import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create your account",
};

export default function SignupPage() {
  return (
    <Card className="w-full max-w-[434px] gap-6 px-6 py-8 shadow-raised sm:px-10">
      {/* Owns the header and body, because both change after the account is created */}
      <SignupForm />
    </Card>
  );
}

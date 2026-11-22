import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";

import { TextLink } from "@/components/common/text-link";
import { Card, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-[434px] gap-6 px-6 py-8 shadow-raised sm:px-10">
      <ForgotPasswordForm />

      <CardFooter className="flex-col gap-4 px-0">
        <Separator />
        <TextLink href="/login">
          <ChevronLeft aria-hidden="true" />
          Back to log in
        </TextLink>
      </CardFooter>
    </Card>
  );
}

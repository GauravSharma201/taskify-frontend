"use client";

import { useEffect, useRef } from "react";
import { MailCheck } from "lucide-react";

import { IconBadge } from "@/components/common/icon-badge";
import { TextLink } from "@/components/common/text-link";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** The signup card body after the account is created: "Check your email". */
export function SignupSentView({ email }: { email: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The card content changed in place: move focus so screen readers announce it.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <>
      <CardHeader className="justify-items-center gap-1 px-0 text-center">
        <IconBadge icon={MailCheck} className="mb-3" />
        <CardTitle>
          <h1 ref={headingRef} tabIndex={-1} className="text-heading-1 outline-none">
            Check your email
          </h1>
        </CardTitle>
        <CardDescription>
          We sent a verification link to <strong className="font-semibold text-ink">{email}</strong>. Open it, then
          log in to finish.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4 px-0">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => {
            // TODO: connect to backend (POST /auth/resendEmailVerifLink)
          }}
        >
          Resend link
        </Button>
        <TextLink href="/login">Back to log in</TextLink>
      </CardContent>
    </>
  );
}

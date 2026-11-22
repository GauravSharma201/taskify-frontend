"use client";

import { useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import { Lock, MailCheck } from "lucide-react";

import { FocusFirstError, FormErrorBanner } from "@/components/common/form-error-banner";
import { FormTextField } from "@/components/common/form-text-field";
import { IconBadge } from "@/components/common/icon-badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

import { forgotPasswordInitialValues, forgotPasswordSchema, type ForgotPasswordValues } from "./forgot-password-schema";

const HEADER_CLASS = "justify-items-center gap-1 px-0 text-center";

/**
 * The forgot-password card body. Swaps from the email form to a "Check your email" view after a valid submit,
 * so it owns the card header too.
 */
export function ForgotPasswordForm() {
  // Last email entered: prefills the form when the user goes back to change it.
  const [email, setEmail] = useState(forgotPasswordInitialValues.email);
  const [sent, setSent] = useState(false);

  if (sent) {
    return <SentView email={email} onChangeEmail={() => setSent(false)} />;
  }

  return (
    <>
      <CardHeader className={HEADER_CLASS}>
        <IconBadge icon={Lock} className="mb-3" />
        <CardTitle>
          <h1 className="text-heading-1">Can’t log in?</h1>
        </CardTitle>
        <CardDescription>Enter your account email and we’ll send you a link to reset your password.</CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <Formik<ForgotPasswordValues>
          initialValues={{ email }}
          validationSchema={forgotPasswordSchema}
          onSubmit={async (values, { setStatus }) => {
            setStatus(undefined); // clear the previous form-level message
            // `values` is valid here: Yup already ran.
            // TODO: connect to backend
            setEmail(values.email);
            setSent(true);
          }}
        >
          {({ isSubmitting }) => (
            // noValidate: Yup shows errors in our style instead of browser popups
            <Form noValidate>
              <FocusFirstError />
              <FieldGroup className="gap-5">
                <FormTextField
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                />
                <FormErrorBanner />
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Send recovery link"}
                </Button>
              </FieldGroup>
            </Form>
          )}
        </Formik>
      </CardContent>
    </>
  );
}

function SentView({ email, onChangeEmail }: { email: string; onChangeEmail: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [resent, setResent] = useState(false);

  // The card content changed in place: move focus so screen readers announce it.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <>
      <CardHeader className={HEADER_CLASS}>
        <IconBadge icon={MailCheck} className="mb-3" />
        <CardTitle>
          <h1 ref={headingRef} tabIndex={-1} className="text-heading-1 outline-none">
            Check your email
          </h1>
        </CardTitle>
        <CardDescription>
          If an account exists for <strong className="font-semibold text-ink">{email}</strong>, we’ve sent a link to
          reset your password.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-3 px-0">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => {
            // TODO: connect to backend
            setResent(true);
          }}
        >
          Resend link
        </Button>
        <p role="status" className="text-small text-ink-muted empty:hidden">
          {resent ? "Link sent again." : ""}
        </p>
        <Button type="button" variant="link" size="inline" onClick={onChangeEmail}>
          Use a different email
        </Button>
      </CardContent>
    </>
  );
}

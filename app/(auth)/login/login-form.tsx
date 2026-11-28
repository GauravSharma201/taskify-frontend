"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Formik } from "formik";
import { KeyRound } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { FormCheckbox } from "@/components/common/form-checkbox";
import { FocusFirstError, FormErrorBanner } from "@/components/common/form-error-banner";
import { FormPasswordField, FormTextField } from "@/components/common/form-text-field";
import { TextLink } from "@/components/common/text-link";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { ApiError } from "@/lib/api/errors";
import { applyApiErrorToForm, type ApiFormErrorMap } from "@/lib/api/form-errors";
import { login, type LoginRequest } from "@/lib/api/endpoints/auth";

import { loginInitialValues, loginSchema, type LoginValues } from "./login-schema";

type VerificationStatus = "email_not_verified" | "link_expired" | null;

const LOGIN_API_ERRORS: ApiFormErrorMap<LoginValues> = {
  fields: { email: "email", password: "password" },
  codes: {}, // 403 codes are handled manually below (they drive UI state, not field errors)
};

function toLoginRequest(values: LoginValues, token: string | null): LoginRequest {
  return {
    email: values.email.toLowerCase(), // known quirk: backend email is case-sensitive
    password: values.password,
    ...(token ? { verificationToken: token } : {}),
    // 'remember' is not included — backend rejects unknown fields with 400
  };
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // token from /login?token=... (email verification link sent by the backend)
  const [verificationToken, setVerificationToken] = useState<string | null>(
    searchParams.get("token")
  );
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(null);

  const loginMutation = useMutation({ mutationFn: login });

  return (
    <div className="flex flex-col gap-6">
      <Formik<LoginValues>
        initialValues={loginInitialValues}
        validationSchema={loginSchema}
        onSubmit={async (values, helpers) => {
          helpers.setStatus(undefined); // clear previous banner
          setVerificationStatus(null); // clear previous resend CTA

          try {
            await loginMutation.mutateAsync(toLoginRequest(values, verificationToken));
            // 200: httpOnly cookies are set by the browser automatically
            // Clean the token from the URL so it isn't visible or reused after login
            window.history.replaceState({}, "", "/login");
            router.push("/dashboard"); // TODO: update once dashboard route is confirmed
          } catch (error) {
            if (error instanceof ApiError) {
              // 404 and 401 both mean wrong credentials — show the same message
              // so the UI does not reveal which emails have accounts
              if (error.status === 404 || error.status === 401) {
                helpers.setStatus({ formError: "Email or password is incorrect." });
                return;
              }
              // 403: verification required — inline CTA handles the message and action
              if (error.code === "EMAIL_NOT_VERIFIED") {
                setVerificationStatus("email_not_verified");
                return;
              }
              if (error.code === "VERIFICATION_LINK_EXPIRED") {
                setVerificationStatus("link_expired");
                setVerificationToken(null); // drop expired token; don't send it again
                return;
              }
            }
            // 400 field errors, 429, 500, network/timeout
            applyApiErrorToForm(error, helpers, LOGIN_API_ERRORS);
          }
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
              <FormPasswordField
                name="password"
                label="Password"
                autoComplete="current-password"
                placeholder="Enter password"
                required
                labelAside={
                  <TextLink href="/forgot-password" className="text-label">
                    Forgot password?
                  </TextLink>
                }
              />
              <FormCheckbox name="remember" label="Remember me" />
              <FormErrorBanner />
              {verificationStatus && (
                <p className="text-sm text-muted-foreground" role="alert">
                  {verificationStatus === "link_expired"
                    ? "Your verification link has expired. "
                    : "Please verify your email before logging in. "}
                  <button
                    type="button"
                    className="underline hover:text-foreground"
                    onClick={() => {
                      // TODO: connect to backend (POST /auth/resendEmailVerifLink)
                    }}
                  >
                    Resend link
                  </button>
                </p>
              )}
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in…" : "Log in"}
              </Button>
            </FieldGroup>
          </Form>
        )}
      </Formik>

      <FieldSeparator>or</FieldSeparator>

      <Button variant="outline" size="lg" className="w-full" asChild>
        <Link href="/login/sso">
          <KeyRound aria-hidden="true" />
          Continue with SSO
        </Link>
      </Button>
    </div>
  );
}

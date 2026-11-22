"use client";

import Link from "next/link";
import { Form, Formik } from "formik";
import { KeyRound } from "lucide-react";

import { FormCheckbox } from "@/components/common/form-checkbox";
import { FocusFirstError, FormErrorBanner } from "@/components/common/form-error-banner";
import { FormPasswordField, FormTextField } from "@/components/common/form-text-field";
import { TextLink } from "@/components/common/text-link";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";

import { loginInitialValues, loginSchema, type LoginValues } from "./login-schema";

export function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <Formik<LoginValues>
        initialValues={loginInitialValues}
        validationSchema={loginSchema}
        onSubmit={async (_values, { setStatus }) => {
          setStatus(undefined); // clear the previous form-level message
          // `_values` is valid here: Yup already ran.
          // TODO: connect to backend
          setStatus({ formError: "Sign-in isn’t connected to a backend yet." });
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

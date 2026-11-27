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
import { toSlug } from "@/lib/slug";

import { signupInitialValues, signupSchema, type SignupValues } from "./signup-schema";

export function SignupForm() {
  return (
    <div className="flex flex-col gap-6">
      <Formik<SignupValues>
        initialValues={signupInitialValues}
        validationSchema={signupSchema}
        onSubmit={async (_values, { setStatus }) => {
          setStatus(undefined); // clear the previous form-level message
          // `_values` is valid here: Yup already ran.
          // TODO: connect to backend
          setStatus({ formError: "Sign-up isn’t connected to a backend yet." });
        }}
      >
        {({ values, isSubmitting }) => (
          // noValidate: Yup shows errors in our style instead of browser popups
          <Form noValidate>
            <FocusFirstError />
            <FieldGroup className="gap-5">
              <FormTextField
                name="fullName"
                label="Full name"
                autoComplete="name"
                placeholder="Enter your full name"
                required
              />
              <FormTextField
                name="email"
                label="Work email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
              />
              <FormPasswordField
                name="password"
                label="Password"
                autoComplete="new-password"
                placeholder="Create a password"
                required
                showStrength
                description="Use 8+ characters with upper and lower case letters, a number and a symbol."
              />
              <FormTextField
                name="organisationName"
                label="Organisation name"
                autoComplete="organization"
                placeholder="e.g. Acme Engineering"
                required
                description={
                  <>
                    {/* Your URL:{" "}
                    <span className="font-semibold text-ink">
                      taskify.app/{toSlug(values.organisationName) || "your-organisation"}
                    </span> */}
                  </>
                }
              />
              <FormCheckbox
                name="acceptTerms"
                label={
                  <>
                    I agree to the <TextLink href="/terms" className="font-normal">Terms of service</TextLink> and{" "}
                    <TextLink href="/privacy" className="font-normal">Privacy policy</TextLink>.
                  </>
                }
              />
              <FormErrorBanner />
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            </FieldGroup>
          </Form>
        )}
      </Formik>

      <FieldSeparator>or</FieldSeparator>

      <Button variant="outline" size="lg" className="w-full" asChild>
        <Link href="/signup/sso">
          <KeyRound aria-hidden="true" />
          Sign up with SSO
        </Link>
      </Button>
    </div>
  );
}

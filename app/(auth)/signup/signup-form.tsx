"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { KeyRound } from "lucide-react";

import { FormCheckbox } from "@/components/common/form-checkbox";
import { FocusFirstError, FormErrorBanner } from "@/components/common/form-error-banner";
import { FormPasswordField, FormTextField } from "@/components/common/form-text-field";
import { TextLink } from "@/components/common/text-link";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { register, type RegisterRequest } from "@/lib/api/endpoints/auth";
import { applyApiErrorToForm, type ApiFormErrorMap } from "@/lib/api/form-errors";
import { toSlug } from "@/lib/slug";

import { signupInitialValues, signupSchema, type SignupValues } from "./signup-schema";
import { SignupSentView } from "./signup-sent-view";

/** Form values → POST /auth/register body. Only the API's fields; the backend rejects unknown ones. */
function toRegisterRequest(values: SignupValues): RegisterRequest {
  return {
    name: values.fullName.trim(), // form "fullName" → API "name"
    email: values.email.trim().toLowerCase(), // the backend treats email as case-sensitive
    password: values.password,
    organisationName: values.organisationName.trim(),
    termsAccepted: values.acceptTerms, // form "acceptTerms" → API "termsAccepted"
  };
}

/** Where each register failure shows on the form. Anything not listed goes to the banner. */
const SIGNUP_API_ERRORS: ApiFormErrorMap<SignupValues> = {
  fields: {
    name: "fullName",
    email: "email",
    password: "password",
    organisationName: "organisationName",
    termsAccepted: "acceptTerms",
  },
  codes: {
    EMAIL_ALREADY_REGISTERED: {
      field: "email",
      message: "An account with this email already exists. Log in instead.",
    },
    ORGANISATION_NAME_TAKEN: {
      field: "organisationName",
      message: "This organisation name is taken. Try another.",
    },
  },
};

/**
 * The signup card body. Swaps from the form to a "Check your email" view after the account is created,
 * so it owns the card header too. See docs/logic/signup.md.
 */
export function SignupForm() {
  const registerMutation = useMutation({ mutationFn: register });

  // The mutation keeps the 201 body, so no extra useState is needed.
  if (registerMutation.isSuccess) {
    return <SignupSentView email={registerMutation.data.user.email} />;
  }

  return (
    <>
      <CardHeader className="gap-1 px-0 text-center">
        <CardTitle>
          <h1 className="text-heading-1">Create your account</h1>
        </CardTitle>
        <CardDescription>Free for teams up to 10 users.</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 px-0">
        <Formik<SignupValues>
          initialValues={signupInitialValues}
          validationSchema={signupSchema}
          onSubmit={async (values, helpers) => {
            helpers.setStatus(undefined); // clear the previous form-level message
            // `values` is valid here: Yup already ran.
            try {
              await registerMutation.mutateAsync(toRegisterRequest(values));
              // success: registerMutation.isSuccess is now true → the sent view renders
            } catch (error) {
              applyApiErrorToForm(error, helpers, SIGNUP_API_ERRORS);
            }
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

        <p className="text-center text-body text-ink-muted">
          Already have an account? <TextLink href="/login">Log in</TextLink>
        </p>
      </CardContent>
    </>
  );
}

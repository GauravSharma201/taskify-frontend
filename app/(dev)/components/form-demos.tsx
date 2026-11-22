"use client";

import type { ReactNode } from "react";
import { Form, Formik, type FormikErrors, type FormikTouched } from "formik";
import * as yup from "yup";

import { emailRule, nameRule, newPasswordRule, passwordRule } from "@/lib/validation/rules";

/** Rules a demo field can use. Keys are strings so the server gallery page can pass them. */
const RULES = {
  email: emailRule,
  password: passwordRule,
  newPassword: newPasswordRule,
  name: nameRule,
} as const;

type DemoValues = Record<string, string | boolean>;

/**
 * Gallery-only Formik wrapper, so the form inputs can be shown in every state.
 * Each demo gets its own form; give each field a unique `name` (it is also the input id).
 */
export function DemoFormik({
  initialValues,
  rules = {},
  initialTouched,
  initialErrors,
  initialStatus,
  children,
}: {
  initialValues: DemoValues;
  /** field name → rule key, e.g. { "demo-email": "email" } */
  rules?: Record<string, keyof typeof RULES>;
  initialTouched?: FormikTouched<DemoValues>;
  initialErrors?: FormikErrors<DemoValues>;
  initialStatus?: { formError?: string };
  children: ReactNode;
}) {
  const schema = yup.object(Object.fromEntries(Object.entries(rules).map(([field, key]) => [field, RULES[key]])));

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      initialTouched={initialTouched}
      initialErrors={initialErrors}
      initialStatus={initialStatus}
      onSubmit={() => {}}
    >
      <Form noValidate className="w-full">
        {children}
      </Form>
    </Formik>
  );
}

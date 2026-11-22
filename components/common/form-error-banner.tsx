"use client";

import { useEffect } from "react";
import { useFormikContext } from "formik";

/** Shape we store in Formik's `status` for form-level messages. */
export type FormStatus = { formError?: string } | undefined;

/** Form-level message from `status.formError`. Render inside <Formik>. */
export function FormErrorBanner() {
  const { status } = useFormikContext<unknown>();
  const message = (status as FormStatus)?.formError;
  if (!message) return null;
  return (
    <p role="alert" className="rounded-md bg-warning-bg px-3 py-2 text-small text-warning-text">
      {message}
    </p>
  );
}

/** Render inside <Form>. After a failed submit, focuses the first invalid field in DOM order. */
export function FocusFirstError() {
  const { isSubmitting, submitCount, isValid } = useFormikContext<unknown>();
  useEffect(() => {
    if (isSubmitting || submitCount === 0 || isValid) return;
    document.querySelector<HTMLElement>("form [aria-invalid='true']")?.focus();
  }, [isSubmitting, submitCount, isValid]);
  return null;
}

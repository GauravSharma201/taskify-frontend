import type { FormikHelpers } from "formik";

import { toApiError } from "./errors";

/** How a form maps API failures onto its own fields. */
export type ApiFormErrorMap<Values> = {
  /** API field name → form field name, for 400 validation errors (e.g. `name` → `fullName`). */
  fields?: Record<string, keyof Values & string>;
  /** Backend `code` → the form field that shows it, with our own wording. */
  codes?: Record<string, { field: keyof Values & string; message: string }>;
};

/**
 * Shows an API failure on a Formik form: under a field when we know which one, else in the banner.
 * See docs/wiring/signup-register.md → 5.6.
 */
export function applyApiErrorToForm<Values>(
  error: unknown,
  { setFieldError, setStatus }: Pick<FormikHelpers<Values>, "setFieldError" | "setStatus">,
  map: ApiFormErrorMap<Values> = {},
): void {
  const apiError = toApiError(error); // already an ApiError from apiClient; safe for anything else

  // A known code, e.g. 409 EMAIL_ALREADY_REGISTERED → under "email"
  const byCode = apiError.code ? map.codes?.[apiError.code] : undefined;
  if (byCode) {
    setFieldError(byCode.field, byCode.message);
    return;
  } 

  // 400 validation: the backend only returns the first failing field
  const firstFieldError = apiError.fieldErrors[0];
  const formField = firstFieldError ? map.fields?.[firstFieldError.field] : undefined;
  if (firstFieldError && formField) {
    setFieldError(formField, firstFieldError.message);
    return;
  }

  // 429, 5xx, network, timeout, unknown field → form-level banner
  setStatus({ formError: apiError.message });
}

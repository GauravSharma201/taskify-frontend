import * as yup from "yup";

/**
 * Reusable field rules. Screen schemas (`<screen>-schema.ts` in each route folder) compose these,
 * so a message or format change here applies to every form.
 * Need a different message on one screen? Chain an override: `emailRule.required("…")`.
 */

export const emailRule = yup
  .string()
  .trim()
  .required("Enter your email address.")
  .email("Enter a valid email address, like you@company.com.");

/** Signing in: any non-empty password. */
export const passwordRule = yup.string().required("Enter your password.");

/** Creating or resetting a password: strength rules. */
export const newPasswordRule = yup
  .string()
  .required("Enter a password.")
  .min(8, "Use at least 8 characters.")
  .matches(/[0-9]/, "Include at least one number.");

/** Confirm field that must match another field (default: "password"). */
export const confirmPasswordRule = (field = "password") =>
  yup
    .string()
    .required("Confirm your password.")
    .oneOf([yup.ref(field)], "Passwords don’t match.");

export const nameRule = yup
  .string()
  .trim()
  .required("Enter your name.")
  .max(100, "Keep it under 100 characters.");

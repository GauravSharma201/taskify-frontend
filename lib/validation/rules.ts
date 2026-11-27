import * as yup from "yup";

import { toSlug } from "@/lib/slug";

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

/** Character checks shared by `newPasswordRule` and the password strength meter. */
export const HAS_UPPER = /[A-Z]/;
export const HAS_LOWER = /[a-z]/;
export const HAS_NUMBER = /[0-9]/;
export const HAS_SYMBOL = /[^A-Za-z0-9]/;
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Creating or resetting a password: 8+ characters with an uppercase letter, a lowercase
 * letter, a number and a symbol. The backend requires upper + lower + number (no symbol),
 * so anything this accepts the backend accepts too.
 */
export const newPasswordRule = yup
  .string()
  .required("Enter a password.")
  .min(MIN_PASSWORD_LENGTH, "Use at least 8 characters.")
  .matches(HAS_UPPER, "Include at least one uppercase letter.")
  .matches(HAS_LOWER, "Include at least one lowercase letter.")
  .matches(HAS_NUMBER, "Include at least one number.")
  .matches(HAS_SYMBOL, "Include at least one symbol.");

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

/** Organisation name; its slug becomes the organisation URL (taskify.app/{slug}). */
export const organisationNameRule = yup
  .string()
  .trim()
  .required("Enter your organisation name.")
  .max(50, "Keep it under 50 characters.")
  .test("has-slug", "Use at least one letter or number.", (value) => !value || toSlug(value) !== "");

/** Must be ticked: agreeing to the Terms of service and Privacy policy. */
// A .test (not .oneOf([true])) keeps the inferred type `boolean`, so initial values can be `false`.
export const acceptTermsRule = yup
  .boolean()
  .required()
  .test("accepted", "Agree to the Terms of service and Privacy policy to continue.", (value) => value === true);

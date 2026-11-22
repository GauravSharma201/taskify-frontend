import * as yup from "yup";

import { emailRule } from "@/lib/validation/rules";

export const forgotPasswordSchema = yup.object({
  email: emailRule,
});

export type ForgotPasswordValues = yup.InferType<typeof forgotPasswordSchema>;

export const forgotPasswordInitialValues: ForgotPasswordValues = {
  email: "",
};

import * as yup from "yup";

import { emailRule, passwordRule } from "@/lib/validation/rules";

export const loginSchema = yup.object({
  email: emailRule,
  password: passwordRule,
  remember: yup.boolean().default(false),
});

export type LoginValues = yup.InferType<typeof loginSchema>;

export const loginInitialValues: LoginValues = {
  email: "",
  password: "",
  remember: false,
};

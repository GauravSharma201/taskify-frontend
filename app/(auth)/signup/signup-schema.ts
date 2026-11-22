import * as yup from "yup";

import {
  acceptTermsRule,
  emailRule,
  nameRule,
  newPasswordRule,
  organisationNameRule,
} from "@/lib/validation/rules";

export const signupSchema = yup.object({
  fullName: nameRule.required("Enter your full name."),
  email: emailRule.required("Enter your work email."),
  password: newPasswordRule,
  organisationName: organisationNameRule,
  acceptTerms: acceptTermsRule,
});

export type SignupValues = yup.InferType<typeof signupSchema>;

export const signupInitialValues: SignupValues = {
  fullName: "",
  email: "",
  password: "",
  organisationName: "",
  acceptTerms: false,
};

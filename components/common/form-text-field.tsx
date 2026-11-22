"use client";

import type { ComponentProps, ReactNode } from "react";

import { PasswordInput } from "@/components/common/password-input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormFieldProps } from "@/hooks/use-form-field-props";

type BaseProps = {
  /** Formik field name; also used as the input `id` */
  name: string;
  label: string;
  required?: boolean;
  /** Extra content on the label row, e.g. a "Forgot password?" link */
  labelAside?: ReactNode;
};

type FormTextFieldProps = BaseProps &
  Omit<ComponentProps<typeof Input>, "name" | "id" | "value" | "onChange" | "onBlur">;

/** Label + Input + error, wired to Formik by `name`. Render inside <Formik>. */
export function FormTextField({ name, label, required, labelAside, ...rest }: FormTextFieldProps) {
  const { error, errorId, inputProps } = useFormFieldProps(name);
  return (
    <Field data-invalid={!!error || undefined}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={name} required={required}>
          {label}
        </FieldLabel>
        {labelAside}
      </div>
      <Input {...rest} {...inputProps} aria-required={required || undefined} />
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}

type FormPasswordFieldProps = BaseProps &
  Omit<ComponentProps<typeof PasswordInput>, "name" | "id" | "value" | "onChange" | "onBlur">;

/** Label + PasswordInput (Show/Hide) + error, wired to Formik by `name`. Render inside <Formik>. */
export function FormPasswordField({ name, label, required, labelAside, ...rest }: FormPasswordFieldProps) {
  const { error, errorId, inputProps } = useFormFieldProps(name);
  return (
    <Field data-invalid={!!error || undefined}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={name} required={required}>
          {label}
        </FieldLabel>
        {labelAside}
      </div>
      <PasswordInput {...rest} {...inputProps} aria-required={required || undefined} />
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}

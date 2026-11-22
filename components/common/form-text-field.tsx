"use client";

import type { ComponentProps, ReactNode } from "react";

import { PasswordInput } from "@/components/common/password-input";
import { PasswordStrengthMeter } from "@/components/common/password-strength-meter";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormFieldProps } from "@/hooks/use-form-field-props";

type BaseProps = {
  /** Formik field name; also used as the input `id` */
  name: string;
  label: string;
  required?: boolean;
  /** Extra content on the label row, e.g. a "Forgot password?" link */
  labelAside?: ReactNode;
  /** Hint under the input, e.g. password rules or a URL preview; linked with `aria-describedby` */
  description?: ReactNode;
};

function LabelRow({ name, label, required, labelAside }: Omit<BaseProps, "description">) {
  return (
    <div className="flex items-center justify-between">
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      {labelAside}
    </div>
  );
}

type FormTextFieldProps = BaseProps &
  Omit<ComponentProps<typeof Input>, "name" | "id" | "value" | "onChange" | "onBlur">;

/** Label + Input + optional hint + error, wired to Formik by `name`. Render inside <Formik>. */
export function FormTextField({ name, label, required, labelAside, description, ...rest }: FormTextFieldProps) {
  const { error, errorId, descriptionId, inputProps } = useFormFieldProps(name, {
    hasDescription: !!description,
  });
  return (
    <Field data-invalid={!!error || undefined}>
      <LabelRow name={name} label={label} required={required} labelAside={labelAside} />
      <Input {...rest} {...inputProps} aria-required={required || undefined} />
      {description && (
        <FieldDescription id={descriptionId} className="m-0 text-ink-muted">
          {description}
        </FieldDescription>
      )}
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}

type FormPasswordFieldProps = BaseProps &
  Omit<ComponentProps<typeof PasswordInput>, "name" | "id" | "value" | "onChange" | "onBlur"> & {
    /** Show the 4-segment strength meter under the input (for new passwords) */
    showStrength?: boolean;
  };

/** Label + PasswordInput (Show/Hide) + optional strength meter and hint + error, wired to Formik. */
export function FormPasswordField({
  name,
  label,
  required,
  labelAside,
  description,
  showStrength,
  ...rest
}: FormPasswordFieldProps) {
  const { error, errorId, descriptionId, inputProps } = useFormFieldProps(name, {
    hasDescription: !!description,
  });
  return (
    <Field data-invalid={!!error || undefined}>
      <LabelRow name={name} label={label} required={required} labelAside={labelAside} />
      <PasswordInput {...rest} {...inputProps} aria-required={required || undefined} />
      {showStrength && <PasswordStrengthMeter value={inputProps.value ?? ""} />}
      {description && (
        <FieldDescription id={descriptionId} className="m-0 text-ink-muted">
          {description}
        </FieldDescription>
      )}
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}

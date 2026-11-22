"use client";

import type { ReactNode } from "react";
import { useField } from "formik";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type FormCheckboxProps = {
  /** Formik field name (boolean value); also used as the checkbox `id` */
  name: string;
  /** Text or inline content, e.g. "I agree to the <TextLink>Terms</TextLink>" */
  label: ReactNode;
  disabled?: boolean;
};

/**
 * Checkbox + label wired to a boolean Formik field, with an error once touched
 * (e.g. a must-accept terms box). Render inside <Formik>.
 * Radix Checkbox is a <button>, so the value is set with `helpers.setValue`, not `onChange`.
 */
export function FormCheckbox({ name, label, disabled }: FormCheckboxProps) {
  const [field, meta, helpers] = useField<boolean>(name);
  const error = meta.touched ? meta.error : undefined;
  const errorId = `${name}-error`;

  return (
    <Field data-invalid={!!error || undefined} data-disabled={disabled || undefined} className="gap-1.5">
      <div className="flex items-start gap-3">
        <Checkbox
          id={name}
          checked={field.value}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onCheckedChange={(checked) => helpers.setValue(checked === true)}
          onBlur={() => helpers.setTouched(true)}
          className="mt-0.5"
        />
        <FieldLabel htmlFor={name} className="block text-body font-normal text-ink">
          {label}
        </FieldLabel>
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}

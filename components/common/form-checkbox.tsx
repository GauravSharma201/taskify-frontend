"use client";

import { useField } from "formik";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";

type FormCheckboxProps = {
  /** Formik field name (boolean value); also used as the checkbox `id` */
  name: string;
  label: string;
  disabled?: boolean;
};

/**
 * Checkbox + label wired to a boolean Formik field. Render inside <Formik>.
 * Radix Checkbox is a <button>, so the value is set with `helpers.setValue`, not `onChange`.
 */
export function FormCheckbox({ name, label, disabled }: FormCheckboxProps) {
  const [field, , helpers] = useField<boolean>(name);
  return (
    <Field orientation="horizontal" data-disabled={disabled || undefined}>
      <Checkbox
        id={name}
        checked={field.value}
        disabled={disabled}
        onCheckedChange={(checked) => helpers.setValue(checked === true)}
        onBlur={() => helpers.setTouched(true)}
      />
      <FieldLabel htmlFor={name} className="text-body text-ink">
        {label}
      </FieldLabel>
    </Field>
  );
}

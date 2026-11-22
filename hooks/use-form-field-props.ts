"use client";

import { useField } from "formik";

type Options = {
  /** The field renders a description (hint) with id `${name}-description` */
  hasDescription?: boolean;
};

/** Turns Formik state for one field into input props and accessibility attributes. */
export function useFormFieldProps(name: string, { hasDescription = false }: Options = {}) {
  const [field, meta] = useField<string>(name);
  // Only show an error once the user has left the field (or submitted)
  const error = meta.touched ? meta.error : undefined;
  const errorId = `${name}-error`;
  const descriptionId = `${name}-description`;
  const describedBy = [hasDescription && descriptionId, error && errorId].filter(Boolean).join(" ");

  return {
    error,
    errorId,
    descriptionId,
    inputProps: {
      ...field, // name, value, onChange, onBlur
      id: name,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy || undefined,
    },
  };
}

"use client";

import { useField } from "formik";

/** Turns Formik state for one field into input props and accessibility attributes. */
export function useFormFieldProps(name: string) {
  const [field, meta] = useField<string>(name);
  // Only show an error once the user has left the field (or submitted)
  const error = meta.touched ? meta.error : undefined;
  const errorId = `${name}-error`;

  return {
    error,
    errorId,
    inputProps: {
      ...field, // name, value, onChange, onBlur
      id: name,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? errorId : undefined,
    },
  };
}

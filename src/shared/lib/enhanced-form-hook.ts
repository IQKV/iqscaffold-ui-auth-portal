import {
  useForm as useMantineForm,
  UseFormInput as MantineUseFormInput,
  UseFormReturnType,
} from "@mantine/form";
import { z } from "zod";
import { createFormResolver } from "./form-validation";

// Standardized form hook using Zod validation
export interface UseFormInput<T extends Record<string, any> = Record<string, any>> extends Omit<
  MantineUseFormInput<T>,
  "validate"
> {
  schema: z.ZodType<any, any, any>;
}

export function useForm<T extends Record<string, any> = Record<string, any>>(
  input: UseFormInput<T>,
): UseFormReturnType<T> {
  const { schema, ...mantineFormInput } = input;

  const formConfig: MantineUseFormInput<T> = {
    ...mantineFormInput,
    validate: createFormResolver(schema),
  };

  return useMantineForm(formConfig);
}

// Legacy alias for backward compatibility (will be removed)
export const useEnhancedForm = useForm;

// Type-safe form field getter
export function getTypedInputProps<T extends Record<string, any>, K extends keyof T>(
  form: UseFormReturnType<T>,
  field: K,
  options?: Parameters<UseFormReturnType<T>["getInputProps"]>[1],
) {
  return form.getInputProps(field as string, options);
}

// Utility to validate specific fields
export function validateField<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  fieldName: keyof T,
  value: any,
  allValues?: T,
): string | null {
  try {
    // Try to validate the entire object and extract field error
    schema.parse({ ...allValues, [fieldName]: value } as T);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find(
        (err) => err.path.length === 1 && err.path[0] === fieldName,
      );
      return fieldError?.message || null;
    }
    return "Validation error";
  }
}

// Utility to get all validation errors
export function getAllValidationErrors<T>(
  schema: z.ZodSchema<T>,
  values: T,
): Record<keyof T, string> | null {
  try {
    schema.parse(values);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return errors as Record<keyof T, string>;
    }
    return null;
  }
}

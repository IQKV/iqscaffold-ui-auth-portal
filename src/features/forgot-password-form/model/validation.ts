import { z } from "zod";
import { formSchemas } from "@/shared/lib/form-validation";
import { ForgotPasswordFormValues } from "./types";

// Use the standardized schema from shared validation
export const forgotPasswordFormSchema = formSchemas.forgotPassword;

// Type inference from schema
export type ForgotPasswordFormSchemaType = z.infer<
  typeof forgotPasswordFormSchema
>;

// Initial values
export const initialForgotPasswordValues: ForgotPasswordFormSchemaType = {
  email: "",
};

// Legacy export for backward compatibility (will be removed)
export const validateForgotPasswordForm =
  "DEPRECATED: Use forgotPasswordFormSchema instead";

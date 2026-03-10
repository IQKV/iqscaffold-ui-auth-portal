import { z } from "zod";
import { formSchemas } from "@/shared/lib/form-validation";

// Use the standardized schema from shared validation
export const resetPasswordFormSchema = formSchemas.resetPassword;

// Type inference from schema
export type ResetPasswordFormSchemaType = z.infer<typeof resetPasswordFormSchema>;

// Initial values
export const initialResetPasswordValues: ResetPasswordFormSchemaType = {
  password: "",
  confirmPassword: "",
};

// Legacy export for backward compatibility (will be removed)
export const validateResetPasswordForm = "DEPRECATED: Use resetPasswordFormSchema instead";

import { z } from "zod";
import { formSchemas } from "@/shared/lib/form-validation";
import { EmailVerificationFormValues } from "./types";

// Use the standardized schema from shared validation for resend verification (email)
export const emailVerificationFormSchema = formSchemas.emailVerification;

// Type inference from schema
export type EmailVerificationFormSchemaType = z.infer<
  typeof emailVerificationFormSchema
>;

// Initial values
export const initialEmailVerificationValues: EmailVerificationFormSchemaType = {
  email: "",
};

// Legacy export for backward compatibility (will be removed)
export const validateEmailVerificationForm =
  "DEPRECATED: Use emailVerificationFormSchema instead";

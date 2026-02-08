import { z } from "zod";
import { formSchemas } from "@/shared/lib/form-validation";

// Use the standardized schema from shared validation
export const verifyEmailFormSchema = formSchemas.emailVerification;

// Type inference from schema
export type VerifyEmailFormSchemaType = z.infer<typeof verifyEmailFormSchema>;

// Initial values
export const initialVerifyEmailValues: VerifyEmailFormSchemaType = {
  email: "",
};

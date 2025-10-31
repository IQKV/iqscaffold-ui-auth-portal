import { z } from "zod";
import { formSchemas } from "@/shared/lib/form-validation";
import { SignInFormValues } from "./types";

// Use the standardized schema from shared validation
export const signInFormSchema = formSchemas.signIn;

// Type inference from schema
export type SignInFormSchemaType = z.infer<typeof signInFormSchema>;

// Initial values
export const initialSignInValues: SignInFormSchemaType = {
  username: "",
  password: "",
  rememberMe: false,
};

// Legacy export for backward compatibility (will be removed)
export const validateSignInForm = "DEPRECATED: Use signInFormSchema instead";

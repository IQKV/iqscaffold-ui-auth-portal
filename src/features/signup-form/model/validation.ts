import { z } from "zod";
import { formSchemas } from "@/shared/lib/form-validation";
import { SignUpFormValues } from "./types";

// Use the standardized schema from shared validation
export const signUpFormSchema = formSchemas.signUp;

// Type inference from schema
export type SignUpFormSchemaType = z.infer<typeof signUpFormSchema>;

// Initial values
export const initialSignUpValues: SignUpFormSchemaType = {
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
};

// Legacy export for backward compatibility (will be removed)
export const validateSignUpForm = "DEPRECATED: Use signUpFormSchema instead";

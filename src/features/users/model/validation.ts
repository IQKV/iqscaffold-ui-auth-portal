import { z } from "zod";
import { validationSchemas } from "@/shared/lib/form-validation";

// User form validation schema
export const userFormSchema = z.object({
  firstName: validationSchemas.firstName,
  lastName: validationSchemas.lastName,
  username: validationSchemas.username,
  email: validationSchemas.email,
  role: z.enum(["user", "admin"], {
    required_error: "Role is required",
    invalid_type_error: "Please select a valid role",
  }),
});

// Type inference from schema
export type UserFormSchemaType = z.infer<typeof userFormSchema>;

// Initial values for creating a new user
export const initialUserValues: UserFormSchemaType = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  role: "user",
};

// For editing existing users
export const createInitialUserValues = (
  user?: Partial<UserFormSchemaType>
): UserFormSchemaType => ({
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  username: user?.username || "",
  email: user?.email || "",
  role: user?.role || "user",
});

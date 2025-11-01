import type { UserFormSchemaType } from "./validation";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from "../api/users-api";

/**
 * Map form data to create user request
 */
export function mapFormToCreateRequest(
  formData: UserFormSchemaType
): CreateUserRequest {
  return {
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    email: formData.email,
    username: formData.username,
    role: formData.role,
  };
}

/**
 * Map form data to update user request
 */
export function mapFormToUpdateRequest(
  formData: UserFormSchemaType
): UpdateUserRequest {
  return {
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    email: formData.email,
    username: formData.username,
    role: formData.role,
  };
}

/**
 * Map user data to form data
 */
export function mapUserToForm(user: User): UserFormSchemaType {
  const nameParts = user.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    firstName,
    lastName,
    username: user.name.toLowerCase().replace(/\s+/g, ""), // Fallback if username not available
    email: user.email,
    role: user.role as "user" | "admin",
  };
}

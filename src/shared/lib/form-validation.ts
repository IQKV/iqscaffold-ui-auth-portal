import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";
import { t } from "@lingui/core/macro";

// Ensure locale is initialized before any translation functions are called
import "@/shared/locales";

// Factory functions to create validation schemas with Lingui
export const createValidationSchemas = () => ({
  email: z
    .string()
    .min(1, t`Email is required`)
    .email(t`Please enter a valid email address`)
    .max(255, t`Email must be less than 255 characters`),

  password: z
    .string()
    .min(8, t`Password must be at least 8 characters`)
    .max(100, t`Password must be less than 100 characters`)
    .regex(
      /(?=.*[a-z])/,
      t`Password must include at least one lowercase letter`
    )
    .regex(
      /(?=.*[A-Z])/,
      t`Password must include at least one uppercase letter`
    )
    .regex(/(?=.*\d)/, t`Password must include at least one number`)
    .regex(
      /(?=.*[@$!%*?&])/,
      t`Password must include at least one special character (@$!%*?&)`
    ),

  username: z
    .string()
    .min(3, t`Username must be at least 3 characters`)
    .max(50, t`Username must be less than 50 characters`)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      t`Username can only contain letters, numbers, and underscores`
    ),

  name: z
    .string()
    .trim()
    .min(1, t`This field is required`)
    .max(100, t`Name must be less than 100 characters`),

  firstName: z
    .string()
    .trim()
    .min(1, t`First name is required`)
    .max(100, t`First name must be less than 100 characters`),

  lastName: z
    .string()
    .trim()
    .min(1, t`Last name is required`)
    .max(100, t`Last name must be less than 100 characters`),

  // Enhanced username/email field for signin
  usernameOrEmail: z
    .string()
    .trim()
    .min(3, t`Username or email must be at least 3 characters`)
    .refine(
      (value) => {
        // Check if it's an email or username
        const isEmail = value.includes("@");
        if (isEmail) {
          return /^\S+@\S+\.\S+$/.test(value);
        }
        // Username validation
        return /^[a-zA-Z0-9_]+$/.test(value);
      },
      t`Please enter a valid username or email address`
    ),

  simplePassword: z.string().min(1, t`Password is required`),
});

// Core validation schemas using Lingui for internationalization (lazy initialization)
let _validationSchemas: ReturnType<typeof createValidationSchemas> | null =
  null;

export const validationSchemas = new Proxy(
  {} as ReturnType<typeof createValidationSchemas>,
  {
    get(target, prop) {
      if (!_validationSchemas) {
        _validationSchemas = createValidationSchemas();
      }
      return _validationSchemas[prop as keyof typeof _validationSchemas];
    },
  }
);

// Form schema builders
export const createFormSchema = <T extends z.ZodRawShape>(shape: T) => {
  return z.object(shape);
};

// Enhanced resolver that works with Mantine forms
export const createFormResolver = <T extends z.ZodSchema>(schema: T) => {
  return zodResolver(schema);
};

// Utility to create password confirmation validation
export const createPasswordConfirmationSchema = (
  passwordField = "password"
) => {
  const schemas = createValidationSchemas();
  return z
    .object({
      [passwordField]: schemas.password,
      confirmPassword: z.string().min(1, t`Please confirm your password`),
    })
    .refine(
      (data) =>
        data[passwordField as keyof typeof data] === data.confirmPassword,
      {
        message: t`Passwords do not match`,
        path: ["confirmPassword"],
      }
    );
};

// Common form schemas
export const createFormSchemas = () => {
  const schemas = createValidationSchemas();
  return {
    signIn: createFormSchema({
      username: schemas.usernameOrEmail,
      password: schemas.simplePassword,
      tenantId: z.string().min(1, t`Organization is required`),
      rememberMe: z.boolean().default(false),
    }),

    signUp: createFormSchema({
      username: schemas.username,
      email: schemas.email,
      firstName: schemas.firstName,
      lastName: schemas.lastName,
      password: schemas.password,
      confirmPassword: z.string().min(1, t`Please confirm your password`),
    }).refine((data) => data.password === data.confirmPassword, {
      message: t`Passwords do not match`,
      path: ["confirmPassword"],
    }),

    forgotPassword: createFormSchema({
      email: schemas.email,
    }),

    resetPassword: createFormSchema({
      password: schemas.password,
      confirmPassword: z.string().min(1, t`Please confirm your password`),
    }).refine((data) => data.password === data.confirmPassword, {
      message: t`Passwords do not match`,
      path: ["confirmPassword"],
    }),

    emailVerification: createFormSchema({
      email: schemas.email,
    }),
  };
};

// Form schemas with lazy initialization
let _formSchemas: ReturnType<typeof createFormSchemas> | null = null;

export const formSchemas = new Proxy(
  {} as ReturnType<typeof createFormSchemas>,
  {
    get(target, prop) {
      if (!_formSchemas) {
        _formSchemas = createFormSchemas();
      }
      return _formSchemas[prop as keyof typeof _formSchemas];
    },
  }
);

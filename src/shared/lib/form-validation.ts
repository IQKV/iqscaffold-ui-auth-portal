import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";
import { t } from "@lingui/core/macro";

// Factory functions to create validation schemas with Lingui
export const createValidationSchemas = () => ({
  email: z
    .string()
    .min(1, t`Email is required`)
    .email(t`Please enter a valid email address`),

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

  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]+$/, t`Please enter a valid phone number`)
    .optional()
    .or(z.literal("")),

  url: z
    .string()
    .url(t`Please enter a valid URL`)
    .optional()
    .or(z.literal("")),

  requiredString: (fieldName: string) =>
    z
      .string()
      .trim()
      .min(1, t`${fieldName} is required`),

  optionalString: z.string().optional().or(z.literal("")),

  positiveNumber: z
    .number()
    .positive(t`Must be a positive number`)
    .or(
      z.string().transform((val) => {
        const num = parseFloat(val);
        if (isNaN(num)) {
          throw new Error(t`Must be a valid number`);
        }
        if (num <= 0) {
          throw new Error(t`Must be a positive number`);
        }
        return num;
      })
    ),

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

// Utility for conditional validation
export const conditionalValidation = <T>(
  condition: (data: any) => boolean,
  schema: z.ZodSchema<T>
) => {
  return z.any().superRefine((data, ctx) => {
    if (condition(data)) {
      const result = schema.safeParse(data);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue(issue);
        });
      }
    }
  });
};

// Array validation helpers
export const createArraySchemas = () => ({
  nonEmptyArray: <T>(itemSchema: z.ZodSchema<T>, message?: string) =>
    z.array(itemSchema).min(1, message || t`At least one item is required`),

  uniqueArray: <T>(itemSchema: z.ZodSchema<T>, message?: string) =>
    z
      .array(itemSchema)
      .refine(
        (items) => new Set(items).size === items.length,
        message || t`All items must be unique`
      ),
});

// Array schemas with lazy initialization
let _arraySchemas: ReturnType<typeof createArraySchemas> | null = null;

export const arraySchemas = new Proxy(
  {} as ReturnType<typeof createArraySchemas>,
  {
    get(target, prop) {
      if (!_arraySchemas) {
        _arraySchemas = createArraySchemas();
      }
      return _arraySchemas[prop as keyof typeof _arraySchemas];
    },
  }
);

// File validation helpers
export const createFileSchemas = () => ({
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      t`File size must be less than 5MB`
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      t`Only JPEG, PNG, and WebP images are allowed`
    ),

  document: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      t`File size must be less than 10MB`
    )
    .refine(
      (file) =>
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      t`Only PDF and Word documents are allowed`
    ),
});

// File schemas with lazy initialization
let _fileSchemas: ReturnType<typeof createFileSchemas> | null = null;

export const fileSchemas = new Proxy(
  {} as ReturnType<typeof createFileSchemas>,
  {
    get(target, prop) {
      if (!_fileSchemas) {
        _fileSchemas = createFileSchemas();
      }
      return _fileSchemas[prop as keyof typeof _fileSchemas];
    },
  }
);

// Date validation helpers
export const createDateSchemas = () => ({
  futureDate: z
    .date()
    .refine((date) => date > new Date(), t`Date must be in the future`),
  pastDate: z
    .date()
    .refine((date) => date < new Date(), t`Date must be in the past`),
  dateRange: (startDate: Date, endDate: Date) => {
    const startDateStr = startDate.toLocaleDateString();
    const endDateStr = endDate.toLocaleDateString();
    return z
      .date()
      .refine(
        (date) => date >= startDate && date <= endDate,
        t`Date must be between ${startDateStr} and ${endDateStr}`
      );
  },
});

// Date schemas with lazy initialization
let _dateSchemas: ReturnType<typeof createDateSchemas> | null = null;

export const dateSchemas = new Proxy(
  {} as ReturnType<typeof createDateSchemas>,
  {
    get(target, prop) {
      if (!_dateSchemas) {
        _dateSchemas = createDateSchemas();
      }
      return _dateSchemas[prop as keyof typeof _dateSchemas];
    },
  }
);

// Common form schemas
export const createFormSchemas = () => {
  const schemas = createValidationSchemas();
  return {
    signIn: createFormSchema({
      username: schemas.usernameOrEmail,
      password: schemas.simplePassword,
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
      code: z.string().min(1, t`Verification code is required`),
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

// Legacy alias for backward compatibility (will be removed)
export const commonSchemas = validationSchemas;

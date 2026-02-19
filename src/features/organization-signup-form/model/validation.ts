import { z } from "zod";
import { t } from "@lingui/core/macro";
import { OrganizationSignupFormValues } from "./types";

/**
 * Organization signup form validation schema
 * Matches backend SelfServiceSignupRequest validation
 */
export const createOrganizationSignUpFormSchema = () =>
  z
    .object({
      organizationName: z
        .string()
        .min(2, t`Organization name must be at least 2 characters`)
        .max(255, t`Organization name must be less than 255 characters`),

      adminUsername: z
        .string()
        .min(3, t`Username must be at least 3 characters`)
        .max(50, t`Username must be less than 50 characters`)
        .regex(
          /^[a-zA-Z0-9_]+$/,
          t`Username can only contain letters, numbers, and underscores`
        ),

      adminEmail: z
        .string()
        .min(1, t`Email is required`)
        .email(t`Please enter a valid email address`)
        .max(255, t`Email must be less than 255 characters`),

      adminPassword: z
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

      adminFirstName: z
        .string()
        .trim()
        .min(1, t`First name is required`)
        .max(100, t`First name must be less than 100 characters`),

      adminLastName: z
        .string()
        .trim()
        .min(1, t`Last name is required`)
        .max(100, t`Last name must be less than 100 characters`),

      tenantId: z
        .string()
        .min(3, t`Tenant ID must be at least 3 characters`)
        .max(100, t`Tenant ID must be less than 100 characters`)
        .regex(
          /^[a-z0-9-]+$/,
          t`Tenant ID can only contain lowercase letters, numbers, and hyphens`
        )
        .optional()
        .or(z.literal("")),

      domain: z
        .string()
        .max(255, t`Domain must be less than 255 characters`)
        .regex(
          /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
          t`Please enter a valid domain name`
        )
        .optional()
        .or(z.literal("")),

      confirmPassword: z.string().min(1, t`Please confirm your password`),
    })
    .refine((data) => data.adminPassword === data.confirmPassword, {
      message: t`Passwords do not match`,
      path: ["confirmPassword"],
    });

// Lazy initialization to avoid calling t() at module load time
let _organizationSignUpFormSchema: ReturnType<
  typeof createOrganizationSignUpFormSchema
> | null = null;

export const organizationSignUpFormSchema = new Proxy(
  {} as ReturnType<typeof createOrganizationSignUpFormSchema>,
  {
    get(target, prop) {
      if (!_organizationSignUpFormSchema) {
        _organizationSignUpFormSchema = createOrganizationSignUpFormSchema();
      }
      return _organizationSignUpFormSchema[
        prop as keyof typeof _organizationSignUpFormSchema
      ];
    },
  }
);

// Type inference from schema
export type OrganizationSignUpFormSchemaType = z.infer<
  ReturnType<typeof createOrganizationSignUpFormSchema>
>;

// Initial values
export const initialOrganizationSignUpValues: OrganizationSignUpFormSchemaType =
  {
    organizationName: "",
    adminUsername: "",
    adminEmail: "",
    adminPassword: "",
    adminFirstName: "",
    adminLastName: "",
    tenantId: "",
    domain: "",
    confirmPassword: "",
  };

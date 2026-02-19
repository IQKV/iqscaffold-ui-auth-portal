/**
 * Organization signup form types
 */

export interface OrganizationSignupFormValues {
  organizationName: string;
  adminUsername: string;
  adminEmail: string;
  adminPassword: string;
  adminFirstName: string;
  adminLastName: string;
  tenantId?: string;
  domain?: string;
  confirmPassword: string;
}

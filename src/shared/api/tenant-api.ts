import { apiClient } from "./base";

/**
 * Tenant/Organization information for discovery
 */
export interface TenantInfo {
  [tenantId: string]: string; // tenantId -> organizationName
}

/**
 * Tenant API
 * Public endpoints for tenant/organization discovery
 *
 * @example Usage in a component:
 * ```tsx
 * import { useTenantStore } from "@/processes/tenant";
 * import { useEffect } from "react";
 *
 * function TenantSelector() {
 *   const { availableTenants, fetchAvailableTenants } = useTenantStore();
 *
 *   useEffect(() => {
 *     fetchAvailableTenants();
 *   }, []);
 *
 *   return (
 *     <select>
 *       {availableTenants && Object.entries(availableTenants).map(([id, name]) => (
 *         <option key={id} value={id}>{name}</option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export const tenantApi = {
  /**
   * Get all active tenants with their organization names
   * This is a public endpoint that doesn't require authentication
   *
   * @returns Map of tenant IDs to organization names
   * @example
   * {
   *   "default": "IQ  Key Value Platform",
   *   "acme": "Acme Corporation"
   * }
   */
  async getAllTenants(): Promise<TenantInfo> {
    const response = await apiClient.get<TenantInfo>("/v1/public/tenants");
    return response.data;
  },
};

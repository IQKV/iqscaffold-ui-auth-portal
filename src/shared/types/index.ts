// Shared types
export type ConfigKeys = "VITE_API_SERVER_URL";

export interface GenericDataResponse<T> {
  data: T;
  errors?: Record<string, string>;
}

export interface SortableItem {
  id: string | number;
  order: number;
}

// Tenant types
export type {
  Tenant,
  TenantSummary,
  TenantResolutionResult,
  TenantContext,
} from "./tenant";

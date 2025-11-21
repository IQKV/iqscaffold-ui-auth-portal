import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosInstance,
} from "axios";
import { getConfig, getFinalMSWConfig } from "@/app/config";
import { normalizeAxiosError } from "@/shared/lib/http-error";
import { notificationService } from "@/shared/lib/notifications";
import { useTenantStore } from "@/processes/tenant";

// When MSW is enabled, use relative URLs so handlers with relative paths match.
const mswEnabled = getFinalMSWConfig().enabled;
const BASE_URL = mswEnabled ? undefined : getConfig("VITE_API_URL_SERVER");

/**
 * Create base axios instance with common configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Ensure cookies are sent globally
axios.defaults.withCredentials = true;

/**
 * Request interceptor to add tenant header
 * Tenant ID comes from JWT token after authentication
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add tenant ID header if available from tenant store
    const tenantId = useTenantStore.getState().currentTenantId;
    if (tenantId && !config.headers["X-Tenant-ID"]) {
      config.headers["X-Tenant-ID"] = tenantId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor for error handling and token refresh
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;

    // If no response or different error, propagate
    if (!status || !original) {
      return Promise.reject(error);
    }

    // 401 handling and token refresh are managed by processes/auth interceptors

    const normalized = normalizeAxiosError(error);
    if (normalized.type === "server") {
      const cfg = original as any;
      if (!cfg?.__suppressGlobalError) {
        notificationService.error({
          title: "Server error",
          message: normalized.message,
        });
      }
    }
    return Promise.reject(normalized);
  }
);

/**
 * Generic API request helper
 */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}

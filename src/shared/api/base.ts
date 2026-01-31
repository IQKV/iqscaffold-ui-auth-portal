import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosInstance,
} from "axios";
import { getConfig, getFinalMSWConfig } from "@/app/config";
import { normalizeAxiosError } from "@/shared/lib/http-error";
import { notificationService } from "@/shared/lib/notifications";
import { useTenantStore } from "@/processes/tenant";
import { i18n } from "@lingui/core";
import { getUserLocalePreference } from "@/shared/lib/locale-preference";
import { getClientLocale } from "@/shared/locales";

// When MSW is enabled, use relative URLs so handlers with relative paths match.
const mswEnabled = getFinalMSWConfig().enabled;
const BASE_URL = mswEnabled ? undefined : getConfig("VITE_API_SERVER_URL");

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
 * Request interceptor to add tenant header and locale headers
 * Tenant ID comes from JWT token after authentication
 * Locale headers support unified backend i18n approach
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add tenant ID header if available from tenant store
    const tenantId = useTenantStore.getState().currentTenantId;
    if (tenantId && !config.headers["X-Tenant-ID"]) {
      config.headers["X-Tenant-ID"] = tenantId;
    }

    // Add locale headers for unified backend i18n support
    // Backend LocaleResolver priority: X-User-Locale > Accept-Language > Default
    config.headers = config.headers ?? {};

    // Always send Accept-Language header (RFC 7231 standard)
    // Used by backend as fallback when X-User-Locale is not present
    const currentLocale = i18n.locale || getClientLocale();
    (config.headers as any)["Accept-Language"] = currentLocale;

    // Send X-User-Locale header if user has explicit preference
    // Backend prioritizes this over Accept-Language for:
    // - API response messages
    // - Validation error messages
    // - Email notifications
    // - Any localized content
    const userPreference = getUserLocalePreference();
    if (userPreference) {
      (config.headers as any)["X-User-Locale"] = userPreference;
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

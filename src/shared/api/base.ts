import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosInstance,
} from "axios";
import { getConfig } from "@/app/config";
import { normalizeAxiosError } from "@/shared/lib/http-error";
import { notificationService } from "@/shared/lib/notifications";
import { TokenManager } from "@/processes/auth";

const BASE_URL = getConfig("VITE_API_URL_SERVER");
const tokenManager = TokenManager.getInstance();

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
 * Request interceptor for adding auth token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token && tokenManager.isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
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

    // Handle 401 Unauthorized - try to refresh token
    if (
      status === 401 &&
      !original._retry &&
      tokenManager.canRefreshSession()
    ) {
      original._retry = true;

      try {
        // Import auth store dynamically to avoid circular dependency
        const { useAuthStore } = await import("@/processes/auth");
        await useAuthStore.getState().refreshTokens();

        // Retry the original request with new token
        const newToken = tokenManager.getAccessToken();
        if (newToken) {
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        const { useAuthStore } = await import("@/processes/auth");
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

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

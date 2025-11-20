import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { normalizeAxiosError } from "./http-error";

/**
 * Configuration for axios instance with RFC 7807 error handling
 */
export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  /**
   * Whether to log requests/responses in development
   * @default true in development
   */
  enableLogging?: boolean;
  /**
   * Custom request interceptor
   */
  onRequest?: (config: any) => any | Promise<any>;
  /**
   * Custom response interceptor
   */
  onResponse?: (
    response: AxiosResponse
  ) => AxiosResponse | Promise<AxiosResponse>;
  /**
   * Custom error interceptor (called before normalization)
   */
  onError?: (error: unknown) => void;
}

/**
 * Creates a configured axios instance with RFC 7807 error handling
 */
export function createApiClient(config: ApiClientConfig = {}): AxiosInstance {
  const {
    baseURL = "/api",
    timeout = 30000,
    headers = {},
    enableLogging = import.meta.env.DEV,
    onRequest,
    onResponse,
    onError,
  } = config;

  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, application/problem+json",
      ...headers,
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      // Add correlation ID for request tracking
      if (!config.headers["x-correlation-id"]) {
        config.headers["x-correlation-id"] =
          `corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      // Add tenant ID header if available
      if (typeof window !== "undefined") {
        try {
          // Import tenant store dynamically to avoid circular dependencies
          const { useTenantStore } = await import("@/processes/tenant");
          const tenantId = useTenantStore.getState().currentTenantId;
          if (tenantId && !config.headers["X-Tenant-ID"]) {
            config.headers["X-Tenant-ID"] = tenantId;
          }
        } catch (error) {
          // Tenant store not available, continue without tenant header
          console.debug("Tenant store not available for request interceptor");
        }
      }

      // Log request in development
      if (enableLogging) {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
          params: config.params,
        });
      }

      // Apply custom request interceptor
      if (onRequest) {
        return await onRequest(config);
      }

      return config;
    },
    (error) => {
      if (enableLogging) {
        console.error("❌ Request error:", error);
      }
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    async (response) => {
      // Log response in development
      if (enableLogging) {
        console.log(
          `✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
          {
            status: response.status,
            headers: response.headers,
            data: response.data,
          }
        );
      }

      // Apply custom response interceptor
      if (onResponse) {
        return await onResponse(response);
      }

      return response;
    },
    (error) => {
      // Log error in development
      if (enableLogging) {
        const normalized = normalizeAxiosError(error);
        console.error(`❌ ${error.response?.status || "Network"} Error:`, {
          type: normalized.type,
          message: normalized.message,
          status: normalized.status,
          code: normalized.code,
          requestId: normalized.requestId,
          correlationId: normalized.correlationId,
          url: error.config?.url,
          method: error.config?.method,
          originalError: error,
        });
      }

      // Apply custom error interceptor
      onError?.(error);

      // Always reject with original error for proper handling downstream
      return Promise.reject(error);
    }
  );

  return instance;
}

/**
 * Default API client instance
 */
export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

/**
 * Utility function to add authentication token to requests
 */
export function addAuthToken(token: string) {
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
}

/**
 * Utility function to remove authentication token
 */
export function removeAuthToken() {
  delete apiClient.defaults.headers.common.Authorization;
}

/**
 * Utility function to set correlation ID for request tracking
 */
export function setCorrelationId(correlationId: string) {
  apiClient.defaults.headers.common["x-correlation-id"] = correlationId;
}

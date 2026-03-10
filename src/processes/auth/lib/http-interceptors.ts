import type { AxiosError, AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { apiClient } from "@/shared/api";
import { TokenManager } from "./token-manager";
import { useAuthStore } from "../model/auth-store";

let attached = false;

export function attachAuthInterceptors() {
  if (attached) {
    return;
  }
  attached = true;

  const tokenManager = TokenManager.getInstance();

  apiClient.interceptors.request.use(
    (config) => {
      const token = tokenManager.getAccessToken();
      if (token && tokenManager.isTokenValid(token)) {
        const hdrs = (config.headers ?? {}) as AxiosRequestHeaders;
        hdrs.Authorization = `Bearer ${token}`;
        config.headers = hdrs;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
      const status = error.response?.status;

      if (!status || !original) {
        return Promise.reject(error);
      }

      if (status === 401 && !original._retry && tokenManager.canRefreshSession()) {
        original._retry = true;
        try {
          await useAuthStore.getState().refreshTokens();
          const newToken = tokenManager.getAccessToken();
          if (newToken) {
            const hdrs = (original.headers ?? {}) as AxiosRequestHeaders;
            hdrs.Authorization = `Bearer ${newToken}`;
            original.headers = hdrs;
            return apiClient(original);
          }
        } catch {
          await useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    },
  );
}

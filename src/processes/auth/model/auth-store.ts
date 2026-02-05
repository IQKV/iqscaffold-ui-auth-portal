/**
 * Auth Store
 * Centralized authentication state management using Zustand
 */

import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { authApi, type TokenResponse, type AuthUser } from "@/shared/api";
import { TokenManager } from "../lib/token-manager";
import { notificationService } from "@/shared/lib/notifications";
import { useTenantStore } from "@/processes/tenant";
import type { AuthStore, LoginCredentials, AuthError } from "./types";

const tokenManager = TokenManager.getInstance();

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

type AuthStoreCreator = StateCreator<
  AuthStore,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  AuthStore
>;

const createAuthStore: AuthStoreCreator = (set, get) => ({
  ...initialState,

  /**
   * Initialize auth state from stored tokens
   */
  initialize: async () => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    try {
      const accessToken = tokenManager.getAccessToken();
      const refreshToken = tokenManager.getRefreshToken();

      if (!accessToken || !refreshToken) {
        set((state) => {
          state.isLoading = false;
          state.isInitialized = true;
        });
        return;
      }

      // If token is valid, we're authenticated
      if (tokenManager.isTokenValid(accessToken)) {
        // TODO: Optionally fetch user data from token or API
        set((state) => {
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.isInitialized = true;
        });

        // Note: Tenant ID will be set when user data is loaded
        // For now, we can try to extract it from the token if needed
      }
      // If token is expired but we have refresh token, try to refresh
      else if (tokenManager.canRefreshSession()) {
        await get().refreshTokens();
      }
      // No valid session
      else {
        tokenManager.clearTokens();
        set((state) => {
          state.isLoading = false;
          state.isInitialized = true;
        });
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      tokenManager.clearTokens();
      set((state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = "Failed to initialize authentication";
      });
    }
  },

  /**
   * Login user with credentials
   */
  login: async (credentials: LoginCredentials) => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    try {
      const response: TokenResponse = await authApi.login(credentials);

      // Store tokens
      tokenManager.setTokens(response.accessToken, response.refreshToken);

      set((state) => {
        state.user = response.user;
        state.accessToken = response.accessToken;
        state.refreshToken = response.refreshToken;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      });

      // Set tenant context from user data
      if (response.user.tenantId) {
        useTenantStore.getState().setTenantId(response.user.tenantId);
      }

      // Notification is handled by the caller (UI layer)
    } catch (error: any) {
      set((state) => {
        state.isLoading = false;
        state.error = error?.message || "Login failed";
      });

      // Rethrow error so that UI can handle it (field errors, notifications)
      throw error;
    }
  },

  /**
   * Logout user and clear session
   */
  logout: async () => {
    set((state) => {
      state.isLoading = true;
    });

    try {
      // Call logout API if we have a valid token
      if (get().isAuthenticated) {
        await authApi.logout();
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear local state and tokens
      tokenManager.clearTokens();

      set((state) => {
        Object.assign(state, {
          ...initialState,
          isInitialized: true,
        });
      });

      // Clear tenant context on logout
      useTenantStore.getState().clearTenant();
    }
  },

  /**
   * Refresh access token using refresh token
   */
  refreshTokens: async () => {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response: TokenResponse = await authApi.refresh({ refreshToken });

      // Store new tokens
      tokenManager.setTokens(response.accessToken, response.refreshToken);

      set((state) => {
        state.user = response.user;
        state.accessToken = response.accessToken;
        state.refreshToken = response.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      });

      // Update tenant context from refreshed user data
      if (response.user.tenantId) {
        useTenantStore.getState().setTenantId(response.user.tenantId);
      }
    } catch (error: any) {
      // Refresh failed, clear session
      tokenManager.clearTokens();

      set((state) => {
        Object.assign(state, {
          ...initialState,
          isInitialized: true,
        });
      });

      throw error;
    }
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set((state) => {
      state.error = null;
    });
  },

  /**
   * Set user data (for updates)
   */
  setUser: (user: AuthUser) => {
    set((state) => {
      state.user = user;
    });
  },
});

export const useAuthStore = create<AuthStore>()(
  devtools(immer(createAuthStore), {
    name: "auth-store",
  })
);

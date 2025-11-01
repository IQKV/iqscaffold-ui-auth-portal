/**
 * Auth Store
 * Centralized authentication state management using Zustand
 */

import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { authApi, type TokenResponse } from "@/shared/api";
import { TokenManager } from "../lib/token-manager";
import { notificationService } from "@/shared/lib/notifications";
import type { AuthStore, LoginCredentials, AuthError } from "./types";
import type { User } from "@/entities/user";

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

      notificationService.success({
        title: "Login Successful",
        message: `Welcome back, ${response.user.firstName}!`,
      });
    } catch (error: any) {
      const authError: AuthError = {
        type: "auth",
        message: error?.message || "Login failed. Please try again.",
      };

      set((state) => {
        state.isLoading = false;
        state.error = authError.message;
      });

      notificationService.error({
        title: "Login Failed",
        message: authError.message,
      });

      throw authError;
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

      notificationService.info({
        title: "Logged Out",
        message: "You have been successfully logged out.",
      });
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
  setUser: (user: User) => {
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

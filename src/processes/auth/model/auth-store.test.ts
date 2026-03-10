import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "./auth-store";
import { authApi } from "@/shared/api";
import { TokenManager } from "../lib/token-manager";
import { notificationService } from "@/shared/lib/notifications";
import { useTenantStore } from "@/processes/tenant";

// Mock dependencies
vi.mock("@/shared/api", () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
  },
}));

vi.mock("../lib/token-manager", () => ({
  TokenManager: {
    getInstance: vi.fn(() => ({
      getAccessToken: vi.fn(),
      getRefreshToken: vi.fn(),
      setTokens: vi.fn(),
      clearTokens: vi.fn(),
      isTokenValid: vi.fn(),
      canRefreshSession: vi.fn(),
    })),
  },
}));

vi.mock("@/shared/lib/notifications", () => ({
  notificationService: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/processes/tenant", () => ({
  useTenantStore: {
    getState: vi.fn(() => ({
      setTenantId: vi.fn(),
      clearTenant: vi.fn(),
    })),
  },
}));

describe("AuthStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  });

  describe("login", () => {
    it("successfully logs in user", async () => {
      const mockResponse = {
        user: {
          id: "1",
          username: "testuser",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          tenantId: "tenant-1",
        },
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };

      vi.mocked(authApi.login).mockResolvedValue(mockResponse as any);

      await useAuthStore.getState().login({
        username: "testuser",
        password: "password123",
        rememberMe: false,
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockResponse.user);
      expect(state.accessToken).toBe("access-token");
      expect(state.refreshToken).toBe("refresh-token");
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("handles login error", async () => {
      const mockError = new Error("Invalid credentials");
      vi.mocked(authApi.login).mockRejectedValue(mockError);

      await expect(
        useAuthStore.getState().login({
          username: "testuser",
          password: "wrong",
          rememberMe: false,
        }),
      ).rejects.toThrow();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeTruthy();
    });
  });

  describe("logout", () => {
    it("successfully logs out user", async () => {
      useAuthStore.setState({
        user: { id: "1" } as any,
        isAuthenticated: true,
        isInitialized: true,
      });

      vi.mocked(authApi.logout).mockResolvedValue(undefined);

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isInitialized).toBe(true);
    });

    it("clears state even if API call fails", async () => {
      useAuthStore.setState({
        user: { id: "1" } as any,
        isAuthenticated: true,
      });

      vi.mocked(authApi.logout).mockRejectedValue(new Error("API error"));

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("clearError", () => {
    it("clears error state", () => {
      useAuthStore.setState({ error: "Some error" });

      useAuthStore.getState().clearError();

      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe("setUser", () => {
    it("updates user data", () => {
      const newUser = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      } as any;

      useAuthStore.getState().setUser(newUser);

      expect(useAuthStore.getState().user).toEqual(newUser);
    });
  });
});

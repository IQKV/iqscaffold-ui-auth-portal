import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTenantStore } from "./tenant-store";
import * as tenantUtils from "@/shared/lib/tenant-utils";

// Mock dependencies
vi.mock("@/shared/lib/tenant-utils", () => ({
  resolveTenantId: vi.fn(),
  setTenantInStorage: vi.fn(),
}));

describe("TenantStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTenantStore.setState({
      currentTenantId: null,
      tenant: null,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  });

  describe("initialize", () => {
    it("initializes tenant from storage", () => {
      vi.mocked(tenantUtils.resolveTenantId).mockReturnValue("tenant-123");

      useTenantStore.getState().initialize();

      const state = useTenantStore.getState();
      expect(state.currentTenantId).toBe("tenant-123");
      expect(state.isInitialized).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it("handles initialization error", () => {
      vi.mocked(tenantUtils.resolveTenantId).mockImplementation(() => {
        throw new Error("Failed to resolve tenant");
      });

      useTenantStore.getState().initialize();

      const state = useTenantStore.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.error).toBeTruthy();
    });
  });

  describe("setTenantId", () => {
    it("sets tenant ID", () => {
      useTenantStore.getState().setTenantId("tenant-456");

      expect(useTenantStore.getState().currentTenantId).toBe("tenant-456");
    });

    it("clears tenant ID when null", () => {
      useTenantStore.setState({ currentTenantId: "tenant-123" });

      useTenantStore.getState().setTenantId(null);

      expect(useTenantStore.getState().currentTenantId).toBeNull();
    });
  });

  describe("setTenant", () => {
    it("sets tenant data", () => {
      const tenant = {
        id: 1,
        tenantId: "tenant-789",
        name: "Test Tenant",
        enabled: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      useTenantStore.getState().setTenant(tenant);

      const state = useTenantStore.getState();
      expect(state.tenant).toEqual(tenant);
      expect(state.currentTenantId).toBe("tenant-789");
    });
  });

  describe("clearTenant", () => {
    it("clears tenant context", () => {
      useTenantStore.setState({
        currentTenantId: "tenant-123",
        tenant: {
          id: 1,
          tenantId: "tenant-123",
          name: "Test",
          enabled: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        error: "Some error",
      });

      useTenantStore.getState().clearTenant();

      const state = useTenantStore.getState();
      expect(state.currentTenantId).toBeNull();
      expect(state.tenant).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe("setError", () => {
    it("sets error state", () => {
      useTenantStore.getState().setError("Test error");

      expect(useTenantStore.getState().error).toBe("Test error");
    });

    it("clears error when null", () => {
      useTenantStore.setState({ error: "Some error" });

      useTenantStore.getState().setError(null);

      expect(useTenantStore.getState().error).toBeNull();
    });
  });
});

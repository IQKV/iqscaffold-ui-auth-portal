import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { TenantInfo } from "./tenant-info";

// Mock tenant hooks
vi.mock("@/processes/tenant", () => ({
  useCurrentTenantId: vi.fn(),
  useCurrentTenant: vi.fn(),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe("TenantInfo", () => {
  let useCurrentTenantId: any;
  let useCurrentTenant: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const tenant = await import("@/processes/tenant");
    useCurrentTenantId = tenant.useCurrentTenantId;
    useCurrentTenant = tenant.useCurrentTenant;

    useCurrentTenantId.mockReturnValue(null);
    useCurrentTenant.mockReturnValue(null);
  });

  it("renders in development mode", () => {
    useCurrentTenantId.mockReturnValue("tenant-123");

    render(
      <TestWrapper>
        <TenantInfo />
      </TestWrapper>
    );

    expect(screen.getByText("Tenant Context")).toBeInTheDocument();
  });

  it("renders with showInProduction prop", () => {
    useCurrentTenantId.mockReturnValue("tenant-123");

    render(
      <TestWrapper>
        <TenantInfo showInProduction />
      </TestWrapper>
    );

    expect(screen.getByText("Tenant Context")).toBeInTheDocument();
  });

  it("displays tenant ID when available", () => {
    useCurrentTenantId.mockReturnValue("tenant-123");
    useCurrentTenant.mockReturnValue(null);

    render(
      <TestWrapper>
        <TenantInfo />
      </TestWrapper>
    );

    expect(screen.getByText("tenant-123")).toBeInTheDocument();
  });

  it("displays full tenant information when available", () => {
    const mockTenant = {
      tenantId: "tenant-123",
      name: "Test Tenant",
      enabled: true,
    };

    useCurrentTenantId.mockReturnValue("tenant-123");
    useCurrentTenant.mockReturnValue(mockTenant);

    render(
      <TestWrapper>
        <TenantInfo />
      </TestWrapper>
    );

    expect(screen.getByText("tenant-123")).toBeInTheDocument();
    expect(screen.getByText("Test Tenant")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("displays disabled status for inactive tenant", () => {
    const mockTenant = {
      tenantId: "tenant-123",
      name: "Test Tenant",
      enabled: false,
    };

    useCurrentTenantId.mockReturnValue("tenant-123");
    useCurrentTenant.mockReturnValue(mockTenant);

    render(
      <TestWrapper>
        <TenantInfo />
      </TestWrapper>
    );

    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });

  it("displays no tenant message when tenant ID is null", () => {
    useCurrentTenantId.mockReturnValue(null);
    useCurrentTenant.mockReturnValue(null);

    render(
      <TestWrapper>
        <TenantInfo />
      </TestWrapper>
    );

    expect(screen.getByText(/No tenant context/i)).toBeInTheDocument();
  });
});

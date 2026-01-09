import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TenantProvider } from "./tenant-provider";
import { useTenantStore } from "../index";

// Mock tenant store
vi.mock("../index", () => ({
  useTenantStore: vi.fn(),
  useTenantInitialized: vi.fn(),
}));

describe("TenantProvider", () => {
  const mockInitialize = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useTenantInitialized } = await import("../index");
    (useTenantInitialized as any).mockReturnValue(true);
    (useTenantStore as any).mockImplementation((selector: any) => {
      const state = {
        initialize: mockInitialize,
      };
      return selector ? selector(state) : state;
    });
    (useTenantStore as any).getState = () => ({
      initialize: mockInitialize,
    });
  });

  it("renders children", () => {
    render(
      <TenantProvider>
        <div data-testid="child-content">Test Content</div>
      </TenantProvider>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("calls initialize when not initialized", async () => {
    const { useTenantInitialized } = await import("../index");
    (useTenantInitialized as any).mockReturnValue(false);

    render(
      <TenantProvider>
        <div>Content</div>
      </TenantProvider>
    );

    expect(mockInitialize).toHaveBeenCalled();
  });

  it("does not call initialize when already initialized", async () => {
    const { useTenantInitialized } = await import("../index");
    (useTenantInitialized as any).mockReturnValue(true);

    render(
      <TenantProvider>
        <div>Content</div>
      </TenantProvider>
    );

    expect(mockInitialize).not.toHaveBeenCalled();
  });

  it("renders children immediately (synchronous initialization)", () => {
    render(
      <TenantProvider>
        <div data-testid="child-content">Test Content</div>
      </TenantProvider>
    );

    // Should render immediately without loading state
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <TenantProvider>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
      </TenantProvider>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });
});

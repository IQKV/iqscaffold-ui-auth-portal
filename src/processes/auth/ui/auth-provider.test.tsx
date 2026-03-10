import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./auth-provider";
import { useAuthStore } from "../index";

// Mock auth store
vi.mock("../index", () => ({
  useAuthStore: vi.fn(),
  useAuthInitialized: vi.fn(),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe("AuthProvider", () => {
  const mockInitialize = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useAuthInitialized } = await import("../index");
    (useAuthInitialized as any).mockReturnValue(true);
    (useAuthStore as any).mockImplementation((selector: any) => {
      const state = {
        initialize: mockInitialize,
      };
      return selector(state);
    });
  });

  it("renders children when initialized", () => {
    render(
      <TestWrapper>
        <AuthProvider>
          <div data-testid="child-content">Test Content</div>
        </AuthProvider>
      </TestWrapper>,
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("calls initialize on mount", () => {
    render(
      <TestWrapper>
        <AuthProvider>
          <div>Content</div>
        </AuthProvider>
      </TestWrapper>,
    );

    expect(mockInitialize).toHaveBeenCalled();
  });

  it("shows loader when not initialized", async () => {
    const { useAuthInitialized } = await import("../index");
    (useAuthInitialized as any).mockReturnValue(false);

    render(
      <TestWrapper>
        <AuthProvider>
          <div data-testid="child-content">Test Content</div>
        </AuthProvider>
      </TestWrapper>,
    );

    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
  });

  it("renders custom fallback when provided and not initialized", async () => {
    const { useAuthInitialized } = await import("../index");
    (useAuthInitialized as any).mockReturnValue(false);

    render(
      <TestWrapper>
        <AuthProvider fallback={<div data-testid="custom-fallback">Loading...</div>}>
          <div data-testid="child-content">Test Content</div>
        </AuthProvider>
      </TestWrapper>,
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
  });

  it("renders children after initialization completes", async () => {
    const { useAuthInitialized } = await import("../index");
    (useAuthInitialized as any).mockReturnValue(false);

    const { rerender } = render(
      <TestWrapper>
        <AuthProvider>
          <div data-testid="child-content">Test Content</div>
        </AuthProvider>
      </TestWrapper>,
    );

    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();

    // Simulate initialization complete
    (useAuthInitialized as any).mockReturnValue(true);

    rerender(
      <TestWrapper>
        <AuthProvider>
          <div data-testid="child-content">Test Content</div>
        </AuthProvider>
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("child-content")).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { UserMenu } from "./user-menu";

// Mock auth store and selectors
vi.mock("../index", () => ({
  useCurrentUser: vi.fn(),
  useAuthStore: vi.fn(),
  useUserFullName: vi.fn(),
  getUserInitials: vi.fn(),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe("UserMenu", () => {
  const mockUser = {
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    tenantId: "tenant-1",
  };

  const mockLogout = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useCurrentUser, useAuthStore, useUserFullName, getUserInitials } =
      await import("../index");

    (useCurrentUser as any).mockReturnValue(mockUser);
    (useUserFullName as any).mockReturnValue("John Doe");
    (getUserInitials as any).mockReturnValue("JD");
    (useAuthStore as any).mockImplementation((selector: any) => {
      const state = {
        logout: mockLogout,
      };
      return selector(state);
    });
  });

  it("renders user menu when user is logged in", () => {
    render(
      <TestWrapper>
        <UserMenu />
      </TestWrapper>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("does not render when user is null", async () => {
    const { useCurrentUser } = await import("../index");
    (useCurrentUser as any).mockReturnValue(null);

    render(
      <TestWrapper>
        <UserMenu />
      </TestWrapper>
    );

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("opens menu when clicked", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UserMenu />
      </TestWrapper>
    );

    const menuButton = screen.getByText("John Doe").closest("button")!;
    await user.click(menuButton);

    // Menu items are rendered in a portal, wait for them
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeInTheDocument();
    });
  });

  it("calls logout when logout menu item is clicked", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <UserMenu />
      </TestWrapper>
    );

    const menuButton = screen.getByText("John Doe").closest("button")!;
    await user.click(menuButton);

    // Menu items are rendered in a portal, wait for them to be visible
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeInTheDocument();
    });

    // Find logout button by text content
    const logoutButton = await screen.findByText("Logout");
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it("renders with custom size", () => {
    render(
      <TestWrapper>
        <UserMenu size="lg" />
      </TestWrapper>
    );

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("displays user initials in avatar", () => {
    render(
      <TestWrapper>
        <UserMenu />
      </TestWrapper>
    );

    const avatar = screen.getByText("JD");
    expect(avatar).toBeInTheDocument();
  });

  it("displays user full name", () => {
    render(
      <TestWrapper>
        <UserMenu />
      </TestWrapper>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("displays user email", () => {
    render(
      <TestWrapper>
        <UserMenu />
      </TestWrapper>
    );

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });
});

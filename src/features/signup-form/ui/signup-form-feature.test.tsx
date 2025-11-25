import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { SignUpFormFeature } from "./signup-form-feature";
import * as authApi from "@/shared/api/auth-api";

// Mock dependencies
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("@/shared/api/auth-api", () => ({
  authApi: {
    signup: vi.fn(),
  },
}));

vi.mock("@mantine/notifications", () => ({
  notifications: {
    show: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>{children}</MantineProvider>
    </QueryClientProvider>
  );
};

describe("SignUpFormFeature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders signup form with all fields", () => {
    render(<SignUpFormFeature />, { wrapper: createWrapper() });

    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("johndoe")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("john.doe@example.com")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Create a strong password")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Re-enter your password")
    ).toBeInTheDocument();
    expect(screen.getByTestId("signup-button-submit")).toBeInTheDocument();
  });

  it("displays login link", () => {
    render(<SignUpFormFeature />, { wrapper: createWrapper() });

    const loginLink = screen.getByTestId("signup-link-login");
    expect(loginLink).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    const mockSignup = vi.spyOn(authApi.authApi, "signup");
    mockSignup.mockResolvedValue({
      message: "Registration successful",
      user: {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      },
    } as any);

    render(<SignUpFormFeature />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText("John"), "John");
    await user.type(screen.getByPlaceholderText("Doe"), "Doe");
    await user.type(screen.getByPlaceholderText("johndoe"), "johndoe");
    await user.type(
      screen.getByPlaceholderText("john.doe@example.com"),
      "john@example.com"
    );
    await user.type(
      screen.getByPlaceholderText("Create a strong password"),
      "Password123!"
    );
    await user.type(
      screen.getByPlaceholderText("Re-enter your password"),
      "Password123!"
    );

    const submitButton = screen.getByTestId("signup-button-submit");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "Password123!",
      });
    });
  });

  it("calls onSuccess callback when provided", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const mockSignup = vi.spyOn(authApi.authApi, "signup");
    const mockResponse = {
      message: "Registration successful",
      user: {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      },
    };
    mockSignup.mockResolvedValue(mockResponse as any);

    render(<SignUpFormFeature onSuccess={onSuccess} />, {
      wrapper: createWrapper(),
    });

    await user.type(screen.getByPlaceholderText("John"), "John");
    await user.type(screen.getByPlaceholderText("Doe"), "Doe");
    await user.type(screen.getByPlaceholderText("johndoe"), "johndoe");
    await user.type(
      screen.getByPlaceholderText("john.doe@example.com"),
      "john@example.com"
    );
    await user.type(
      screen.getByPlaceholderText("Create a strong password"),
      "Password123!"
    );
    await user.type(
      screen.getByPlaceholderText("Re-enter your password"),
      "Password123!"
    );

    await user.click(screen.getByTestId("signup-button-submit"));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockResponse);
    });
  });

  it("calls onNavigateToLogin callback when link clicked", async () => {
    const user = userEvent.setup();
    const onNavigateToLogin = vi.fn();

    render(<SignUpFormFeature onNavigateToLogin={onNavigateToLogin} />, {
      wrapper: createWrapper(),
    });

    const loginLink = screen.getByTestId("signup-link-login");
    await user.click(loginLink);

    expect(onNavigateToLogin).toHaveBeenCalled();
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();
    const mockSignup = vi.spyOn(authApi.authApi, "signup");
    mockSignup.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<SignUpFormFeature />, { wrapper: createWrapper() });

    await user.type(screen.getByTestId("signup-input-firstname"), "John");
    await user.type(screen.getByTestId("signup-input-lastname"), "Doe");
    await user.type(screen.getByTestId("signup-input-username"), "johndoe");
    await user.type(
      screen.getByTestId("signup-input-email"),
      "john@example.com"
    );
    await user.type(
      screen.getByTestId("signup-input-password"),
      "Password123!"
    );
    await user.type(
      screen.getByTestId("signup-input-confirm-password"),
      "Password123!"
    );

    const submitButton = screen.getByTestId("signup-button-submit");
    await user.click(submitButton);

    // Button should be in loading state
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});

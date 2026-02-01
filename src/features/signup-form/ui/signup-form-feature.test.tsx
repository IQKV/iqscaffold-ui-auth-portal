import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { SignUpFormFeature } from "./signup-form-feature";
import { authApi } from "@/shared/api";

// Mock dependencies
vi.mock("@/shared/api", () => ({
  authApi: {
    signup: vi.fn(),
  },
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
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

  it("renders signup form correctly", () => {
    render(<SignUpFormFeature />, { wrapper: createWrapper() });

    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
    expect(screen.getByTestId("signup-input-firstname")).toBeInTheDocument();
    expect(screen.getByTestId("signup-input-lastname")).toBeInTheDocument();
    expect(screen.getByTestId("signup-input-username")).toBeInTheDocument();
    expect(screen.getByTestId("signup-input-email")).toBeInTheDocument();
    expect(screen.getByTestId("signup-input-password")).toBeInTheDocument();
    expect(
      screen.getByTestId("signup-input-confirm-password")
    ).toBeInTheDocument();
    expect(screen.getByTestId("signup-button-submit")).toBeInTheDocument();
  });

  it("handles user input correctly", async () => {
    const user = userEvent.setup();
    render(<SignUpFormFeature />, { wrapper: createWrapper() });

    const firstNameInput = screen.getByPlaceholderText("John");
    const lastNameInput = screen.getByPlaceholderText("Doe");
    const usernameInput = screen.getByPlaceholderText("johndoe");
    const emailInput = screen.getByPlaceholderText("john.doe@example.com");

    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(usernameInput, "johndoe");
    await user.type(emailInput, "john@example.com");

    expect(firstNameInput).toHaveValue("John");
    expect(lastNameInput).toHaveValue("Doe");
    expect(usernameInput).toHaveValue("johndoe");
    expect(emailInput).toHaveValue("john@example.com");
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      message: "Registration successful",
      user: { id: "1", username: "johndoe" },
    };
    (authApi.signup as any).mockResolvedValue(mockResponse);

    render(<SignUpFormFeature />, { wrapper: createWrapper() });

    const firstNameInput = screen.getByPlaceholderText("John");
    const lastNameInput = screen.getByPlaceholderText("Doe");
    const usernameInput = screen.getByPlaceholderText("johndoe");
    const emailInput = screen.getByPlaceholderText("john.doe@example.com");
    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your new password"
    );
    const submitButton = screen.getByTestId("signup-button-submit");

    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(usernameInput, "johndoe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "Password123!");
    await user.type(confirmPasswordInput, "Password123!");
    await user.click(submitButton);

    // Just verify the API was called, don't wait for navigation
    expect(authApi.signup).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      email: "john@example.com",
      password: "Password123!",
    });
  });

  it("displays login link", () => {
    render(<SignUpFormFeature />, { wrapper: createWrapper() });

    const loginLink = screen.getByTestId("signup-link-login");
    expect(loginLink).toBeInTheDocument();
  });

  it("calls onNavigateToLogin callback when provided", async () => {
    const user = userEvent.setup();
    const onNavigateToLogin = vi.fn();

    render(<SignUpFormFeature onNavigateToLogin={onNavigateToLogin} />, {
      wrapper: createWrapper(),
    });

    const loginLink = screen.getByTestId("signup-link-login");
    await user.click(loginLink);

    expect(onNavigateToLogin).toHaveBeenCalled();
  });

  it("calls onSuccess callback after successful registration", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const mockResponse = {
      message: "Registration successful",
      user: { id: "1", username: "johndoe" },
    };
    (authApi.signup as any).mockResolvedValue(mockResponse);

    render(<SignUpFormFeature onSuccess={onSuccess} />, {
      wrapper: createWrapper(),
    });

    const firstNameInput = screen.getByPlaceholderText("John");
    const lastNameInput = screen.getByPlaceholderText("Doe");
    const usernameInput = screen.getByPlaceholderText("johndoe");
    const emailInput = screen.getByPlaceholderText("john.doe@example.com");
    const passwordInput = screen.getByPlaceholderText(
      "Create a strong password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your new password"
    );
    const submitButton = screen.getByTestId("signup-button-submit");

    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(usernameInput, "johndoe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "Password123!");
    await user.type(confirmPasswordInput, "Password123!");
    await user.click(submitButton);

    // Wait for the mutation to complete and callback to be called
    await waitFor(
      () => {
        expect(onSuccess).toHaveBeenCalledWith(mockResponse);
      },
      { timeout: 3000 }
    );
  });
});

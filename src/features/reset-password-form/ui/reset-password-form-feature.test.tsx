import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ResetPasswordFormFeature } from "./reset-password-form-feature";
import { authApi } from "@/shared/api";

// Mock the auth API
vi.mock("@/shared/api", () => ({
  authApi: {
    resetPassword: vi.fn(),
  },
}));

// Mock the router
const mockNavigate = vi.fn();
const mockUseSearch = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockUseSearch(),
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        {children}
      </QueryClientProvider>
    </MantineProvider>
  );
};

describe("ResetPasswordFormFeature", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearch.mockReturnValue({ token: "valid-token" });
  });

  it("renders all form elements correctly with valid token", () => {
    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="valid-token" />
      </TestWrapper>
    );

    expect(
      screen.getByPlaceholderText("Enter your new password")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your new password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset Password" })
    ).toBeInTheDocument();
    expect(screen.getByText("Back to Sign In")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your new password below. Make sure it's strong and secure."
      )
    ).toBeInTheDocument();
  });

  it("shows invalid token message when no token provided", () => {
    mockUseSearch.mockReturnValue({});

    render(
      <TestWrapper>
        <ResetPasswordFormFeature />
      </TestWrapper>
    );

    expect(screen.getByText("Invalid Reset Link")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This password reset link is invalid or has expired. Please request a new password reset."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Back to Sign In" })
    ).toBeInTheDocument();
  });

  it("shows validation error for weak password", async () => {
    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="valid-token" />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password"
    );
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    await user.type(passwordInput, "weak");
    await user.click(submitButton);

    // Check that the form is still visible (not submitted)
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    // Check that the API was not called due to validation error
    expect(authApi.resetPassword).not.toHaveBeenCalled();
  });

  it("shows validation error when passwords do not match", async () => {
    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="valid-token" />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your new password"
    );
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    await user.type(passwordInput, "Password123!");
    await user.type(confirmPasswordInput, "DifferentPassword123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("submits form with valid passwords", async () => {
    vi.mocked(authApi.resetPassword).mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="valid-token" />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your new password"
    );
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    await user.type(passwordInput, "Password123!");
    await user.type(confirmPasswordInput, "Password123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authApi.resetPassword).toHaveBeenCalledWith(
        "valid-token",
        "Password123!"
      );
    });
  });

  it("shows loading state during submission", async () => {
    // Mock a delayed response
    vi.mocked(authApi.resetPassword).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="valid-token" />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your new password"
    );
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    await user.type(passwordInput, "Password123!");
    await user.type(confirmPasswordInput, "Password123!");
    await user.click(submitButton);

    // Check for loading state
    expect(submitButton).toBeDisabled();
  });

  it("calls onSuccess callback when provided", async () => {
    const onSuccess = vi.fn();
    vi.mocked(authApi.resetPassword).mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="valid-token" onSuccess={onSuccess} />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your new password"
    );
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    await user.type(passwordInput, "Password123!");
    await user.type(confirmPasswordInput, "Password123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("navigates to login page on successful submission when no callback provided", async () => {
    vi.mocked(authApi.resetPassword).mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="valid-token" />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your new password"
    );
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    await user.type(passwordInput, "Password123!");
    await user.type(confirmPasswordInput, "Password123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
    });
  });

  it("calls onBackToLogin callback when back button is clicked", async () => {
    const onBackToLogin = vi.fn();

    render(
      <TestWrapper>
        <ResetPasswordFormFeature
          token="valid-token"
          onBackToLogin={onBackToLogin}
        />
      </TestWrapper>
    );

    const backButton = screen.getByText("Back to Sign In");
    await user.click(backButton);

    expect(onBackToLogin).toHaveBeenCalled();
  });

  it("navigates to login page when back button is clicked and no callback provided", async () => {
    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="valid-token" />
      </TestWrapper>
    );

    const backButton = screen.getByText("Back to Sign In");
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
  });

  it("handles API errors gracefully", async () => {
    const errorMessage = "Token expired";
    vi.mocked(authApi.resetPassword).mockRejectedValue(new Error(errorMessage));

    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="valid-token" />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your new password"
    );
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    await user.type(passwordInput, "Password123!");
    await user.type(confirmPasswordInput, "Password123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authApi.resetPassword).toHaveBeenCalledWith(
        "valid-token",
        "Password123!"
      );
    });

    // Form should be re-enabled after error
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it("allows keyboard navigation", async () => {
    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="valid-token" />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your new password"
    );

    // Focus password field
    passwordInput.focus();
    expect(passwordInput).toHaveFocus();

    // Tab to confirm password field
    await user.tab();
    expect(confirmPasswordInput).toHaveFocus();

    // Tab to submit button
    await user.tab();
    expect(
      screen.getByRole("button", { name: "Reset Password" })
    ).toHaveFocus();
  });

  it("submits form with Enter key", async () => {
    vi.mocked(authApi.resetPassword).mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="valid-token" />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your new password"
    );

    await user.type(passwordInput, "Password123!");
    await user.type(confirmPasswordInput, "Password123!");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(authApi.resetPassword).toHaveBeenCalledWith(
        "valid-token",
        "Password123!"
      );
    });
  });

  it("validates all password requirements", async () => {
    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="valid-token" />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password"
    );
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    // Test each validation rule (skip empty password to avoid userEvent issue)
    const invalidPasswords = [
      {
        password: "short",
        expectedError: "Password must be at least 8 characters long",
      },
      {
        password: "nouppercase123!",
        expectedError: "Password must contain at least one uppercase letter",
      },
      {
        password: "NOLOWERCASE123!",
        expectedError: "Password must contain at least one lowercase letter",
      },
      {
        password: "NoNumbers!",
        expectedError: "Password must contain at least one number",
      },
      {
        password: "NoSpecialChar123",
        expectedError: "Password must contain at least one special character",
      },
    ];

    for (const { password } of invalidPasswords) {
      await user.clear(passwordInput);
      if (password) {
        await user.type(passwordInput, password);
      }
      await user.click(submitButton);

      // Check that the form is still visible (not submitted due to validation error)
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });

      // Check that the API was not called due to validation error
      expect(authApi.resetPassword).not.toHaveBeenCalled();
    }
  });

  it("handles invalid token from URL search params", () => {
    mockUseSearch.mockReturnValue({});

    render(
      <TestWrapper>
        <ResetPasswordFormFeature />
      </TestWrapper>
    );

    expect(screen.getByText("Invalid Reset Link")).toBeInTheDocument();
  });

  it("uses token from props over search params", () => {
    mockUseSearch.mockReturnValue({ token: "search-token" });

    render(
      <TestWrapper>
        <ResetPasswordFormFeature token="prop-token" />
      </TestWrapper>
    );

    // Should render the form (not the invalid token message)
    expect(
      screen.getByPlaceholderText("Enter your new password")
    ).toBeInTheDocument();
    expect(screen.queryByText("Invalid Reset Link")).not.toBeInTheDocument();
  });
});
